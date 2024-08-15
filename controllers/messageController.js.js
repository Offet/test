import multer from 'multer';
import path from 'path';
import Message from '../models/message.js';
import { uploadFileToSaveFiles } from '../utils/saveFilesHelper.js'; // Import the upload function
import nodemailer from 'nodemailer';

// Set up file upload destination and naming
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
export const upload = multer({ storage });

// Set up the email transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

// Handle the form submission
export const handleFormSubmit = [upload.single('file'), async (req, res) => {
  const { title, message, duration, recipient } = req.body;
  const file = req.file;

  // Validate inputs
  if (!title || !message || !duration || !recipient) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Create a new message instance
  const newMessage = new Message({
    title,
    message,
    recipient,
    scheduledAt: new Date(duration) // Parse the duration into a Date object
  });

  try {
    if (file) {
      // Upload the file to SaveFiles.org and get the URL
      const fileUploadResponse = await uploadFileToSaveFiles(file.path);
      newMessage.file = fileUploadResponse.fileUrl; // Assuming the API returns a fileUrl
    }

    // Save the message to the database
    await newMessage.save();

    // Send an email
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: recipient, // Send email to the specified recipient
      subject: title,
      text: message,
      attachments: file ? [{ path: file.path }] : []
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: 'Message saved and sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save or send message' });
  }
}];
