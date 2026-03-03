// uploads/multer.js

const multer = require('multer');
const path = require('path');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the directory where files will be uploaded
  },
  filename: function (req, file, cb) {
    // Use Date.now() to avoid filename conflicts, and use the file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer with the storage configuration
const upload = multer({ 
  storage: storage,
  // Don't filter any fields - let all form fields through
});

module.exports = upload;