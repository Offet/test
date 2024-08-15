import { Router } from "express";
import { createContent, deleteContent, getContentById, updateContent } from "../controllers/content.js";
import { remoteUpload } from "../middlewares/uploads.js";

export const contentRouter = Router();

// contentRouter.post("/content", remoteUpload.single("contentData"), createContent);

// contentRouter.post("/allcontents", getcontents);

// new code from theody
contentRouter.post("/content", remoteUpload.single("contentData"), createContent);
// Update your content router to also look like this

contentRouter.get("/content:id", getContentById);

contentRouter.post("/updatecontent", updateContent);

    
contentRouter.post("/delete",  deleteContent);