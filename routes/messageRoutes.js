import express from 'express';
import { handleFormSubmit } from '../controllers/messageController.js';

// import validateMessage from '../validators/messageValidator.js';
// import { validateMessage } from '../validators/messageValidator.js';

const messageRouter = express.Router();

// Route for submitting messages
messageRouter.post('/messages', handleFormSubmit);

export default messageRouter;
