// server.js (Node.js/Express)
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const app = express();
const cors = require('cors');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }
  
  if (!file.mimetype.startsWith('image/')) {
    return res.status(400).send({ error: 'Invalid file type. Only images are allowed.' });
  }
  const stream = cloudinary.uploader.upload_stream(
    { folder: 'shop_images' },
    (error, result) => {
      if (error) {
        return res.status(500).send({ error: error.message });
      }
      res.send({ url: result.secure_url });
    }
  );

  streamifier.createReadStream(file.buffer).pipe(stream);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});