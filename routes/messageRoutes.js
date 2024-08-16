import express from 'express';
import { handleFormSubmit } from '../controllers/messageController.js';
import { remoteUpload } from '../middlewares/uploads.js';


// import validateMessage from '../validators/messageValidator.js';
// import { validateMessage } from '../validators/messageValidator.js';

const messageRouter = express.Router();

// Route for submitting messages
messageRouter.post('/messages', remoteUpload.single("file"), handleFormSubmit);

export default messageRouter;
