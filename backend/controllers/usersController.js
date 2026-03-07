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
    let cvFilename = null;
    let avatarFilename = null;

    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
    // console.log(`File ${index}:`, file.fieldname, file.originalname, file.filename);
        if (file.fieldname === 'cv') {
          cvFilename = file.filename;
        } else if (file.fieldname === 'avatar') {
          avatarFilename = file.filename;
        }
      });
    }
    
    const userData = {
      ...req.body,
      avatar: avatarFilename,
      cv: cvFilename,
    };

    const hasUserData = req.body.name || req.body.email || req.body.role || req.body.about || req.body.github || req.body.whatsapp;
    
    if (!hasUserData && !cvFilename && !avatarFilename) {
      return res.status(400).json({ error: 'No user data provided' });
    }

    if (hasUserData || cvFilename || avatarFilename) {
      const newUser = new User(userData);
      await newUser.save();
      res.json({ message: 'User saved successfully', user: newUser });
    } else {
      return res.status(400).json({ error: 'No user data provided' });
    }
  } catch (err) {
    // console.error('Error saving user:', err);
    res.status(500).json({ error: err.message });
  }
};
module.exports = { postUser, getUser };