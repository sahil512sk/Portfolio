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
        console.log("Received request body:", req.body);

        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // Handle multiple projects
        let projectsToSave = [];

        if (req.body.projects && Array.isArray(req.body.projects)) {
            // Multiple projects
            projectsToSave = req.body.projects.filter(project =>
                project.title && project.description && project.gitlink && project.livelink
            );
        } else if (req.body.title && req.body.description && req.body.gitlink && req.body.livelink) {
            // Single project
            projectsToSave = [req.body];
        }

        if (projectsToSave.length === 0) {
            return res.status(400).json({ error: 'No valid projects to save. All fields (title, description, gitlink, livelink) are required for each project.' });
        }

        // Save all projects
        const savedProjects = await Project.insertMany(projectsToSave);

        res.json({ message: `${savedProjects.length} projects saved successfully`, projects: savedProjects });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { postProject, getProject };