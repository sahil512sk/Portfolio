// const express = require('express');

// const router = express.Router();
// const multer = require('../uploads/multer');
// const { postUser, getUser } = require('../controllers/usersController');


// router.get('/getUsers', getUser);
// router.post('/postUsers', multer.fields([{ name: 'cv', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), postUser);

const express = require('express');
const router = express.Router();
const multer = require('../uploads/multer');  // Import the correct multer config
const { postUser, getUser } = require('../controllers/usersController');

// Apply the multer middleware before the postUser controller
router.post('/postUsers', multer.any(), postUser);

module.exports = router;