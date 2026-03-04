const Project = require('../models/projectsModel');
const getProject = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const postProject = async (req, res) => {
    try {
        console.log("Received request body:", req.body);  // More detailed logging

        // Ensure req.body is an object and contains the expected properties
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // Ensure required fields exist in the request body
        const { title, description, gitLink, liveLink } = req.body;
        if (!title || !description || !gitLink || !liveLink) {
            return res.status(400).json({ error: 'All fields (title, description, gitLink, liveLink) are required' });
        }

        // Create new project instance
        const newProject = new Project({ title, description, gitLink, liveLink });

        // Save the new project to the database
        await newProject.save();

        // Respond with the newly created project
        res.json(newProject);
    } catch (err) {
        console.error(err); // For debugging
        res.status(500).json({ error: err.message });
    }
};

module.exports = { postProject, getProject };

module.exports = { postProject, getProject };