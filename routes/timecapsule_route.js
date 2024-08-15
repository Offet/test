import { Router } from "express";
import { createTimeCapsule, deleteTimeCapsule, getTimeCapsuleById, getTimeCapsules, updateTimeCapsule } from "../controllers/time_capsule.js";

export const timeCapsuleRouter = Router();

timeCapsuleRouter.post("/timeCapsule", createTimeCapsule);

timeCapsuleRouter.post("/alltimeCapsules", getTimeCapsules);

timeCapsuleRouter.post("/timeCapsule:id", getTimeCapsuleById);

timeCapsuleRouter.post("/updatetimeCapsule", updateTimeCapsule);

    
timeCapsuleRouter.get("/delete",  deleteTimeCapsule);