import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  file: {
    type: String // Store the file path or URL
  },
  recipient: {
    type: String, // Store recipient email address
    required: true
  },
  duration: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
