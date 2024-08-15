import mongoose from "mongoose";
import "dotenv/config";


//  create a database

const mongoUri = process.env.MONGO_URL;

//  create and export the database connection
export const dbConnection = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log("Database is connected!");
    } catch (error) {
        console.log(error);
    }
};
