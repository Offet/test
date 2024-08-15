import express from "express";
import { dbConnection } from "./config/db.js";
import expressOasGenerator from "@mickeymond/express-oas-generator";
import cors from "cors";
import errorHandler from "errorhandler";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import userRouter from "./routes/user_route.js";
import { restartServer } from "./restart_server.js";
//import { profileRouter } from "./routes/profile_route.js";
import { contentRouter } from "./routes/content_route.js";
import { timeCapsuleRouter } from "./routes/timecapsule_route.js";
import messageRouter from "./routes/messageRoutes.js";

// Instantiate express
const app = express();

// Use middlewares
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.static("uploads"));

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "UP" });
});

expressOasGenerator.handleResponses(app, {
  alwaysServeDocs: true,
  tags: ["users", "profiles", "timeCapsules", "messages"],
  mongooseModels: mongoose.modelNames(),
});

// Create a DB connection
// dbConnection();

app.use(express.json());

// Use session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

// Use routes
app.use("/api/v1", userRouter);
//app.use("/api/v1", profileRouter);
app.use("/api/v1", contentRouter);
app.use("/api/v1", timeCapsuleRouter);
app.use("/api/v1", messageRouter)

// Handle all documentation
expressOasGenerator.handleRequests();
app.use((req, res) => res.redirect("/api-docs/"));

// Error handling middleware
app.use(errorHandler({ log: false }));

// Error handler to restart server on errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  restartServer();
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  restartServer();
});

// Create a DB connection and listen to app on port
dbConnection()
  .then(() => {
    const PORT = process.env.PORT || 3550;
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
