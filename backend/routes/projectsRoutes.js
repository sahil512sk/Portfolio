const express = require('express');
const router = express.Router();
const { getProject, postProject } = require('../controllers/projectsController');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/getProjects', getProject);
router.post('/postProjects', upload.single('image'), postProject);

module.exports = router;