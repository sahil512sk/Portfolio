const express = require('express');
const router = express.Router();
const { getProject, postProject } = require('../controllers/projectsController');

router.get('/getProjects', getProject);
router.post('/postProjects', postProject);

module.exports = router;