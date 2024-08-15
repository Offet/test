import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Load environment variables
const API_KEY = process.env.SAVEFILESORG_API_KEY;

// Function to upload a file to SaveFiles.org
export const uploadFileToSaveFiles = async (filePath) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post('https://api.savefiles.org/upload', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
