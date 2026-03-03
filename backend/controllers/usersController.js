const User = require('../models/usersModel');

const getUser = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const postUser = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the form data
    console.log('Request Files:', req.files); // Log the files uploaded through multer
    console.log('Files length:', req.files ? req.files.length : 0);

    // Process files from multer.any() - files are in req.files array
    let cvFilename = null;
    let avatarFilename = null;

    if (req.files && req.files.length > 0) {
      console.log('Processing files:');
      req.files.forEach((file, index) => {
        console.log(`File ${index}:`, file.fieldname, file.originalname, file.filename);
        if (file.fieldname === 'cv') {
          cvFilename = file.filename;
        } else if (file.fieldname === 'avatar') {
          avatarFilename = file.filename;
        }
      });
    }

    console.log('Final filenames - CV:', cvFilename, 'Avatar:', avatarFilename);

    // Check if files exist and assign them to the user data
    const userData = {
      ...req.body,
      avatar: avatarFilename,
      cv: cvFilename,
    };

    console.log('User data to save:', userData);

    const newUser = new User(userData);
    await newUser.save();

    res.json({ message: 'User saved successfully', user: newUser });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { postUser, getUser };