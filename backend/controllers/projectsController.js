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
        let projectsToSave = [];

        if (req.file) {
            const titles = Array.isArray(req.body.title) ? req.body.title : [req.body.title];
            const descriptions = Array.isArray(req.body.description) ? req.body.description : [req.body.description];
            const gitlinks = Array.isArray(req.body.gitlink) ? req.body.gitlink : [req.body.gitlink];
            const livelinks = Array.isArray(req.body.livelink) ? req.body.livelink : [req.body.livelink];
            const numProjects = Math.max(titles?.length || 0, descriptions?.length || 0, gitlinks?.length || 0, livelinks?.length || 0, 1);

            for (let i = 0; i < numProjects; i++) {
                projectsToSave[i] = {};
                if (titles[i]) projectsToSave[i].title = titles[i];
                if (descriptions[i]) projectsToSave[i].description = descriptions[i];
                if (gitlinks[i]) projectsToSave[i].gitlink = gitlinks[i];
                if (livelinks[i]) projectsToSave[i].livelink = livelinks[i];
                
                if (i === 0 && req.file) {
                    projectsToSave[i].image = req.file.filename;
                }
            }
        // } else if (req.files && req.files.image) {
        //     const projectImages = req.files.image;
        //     const titles = Array.isArray(req.body.title) ? req.body.title : [req.body.title];
        //     const descriptions = Array.isArray(req.body.description) ? req.body.description : [req.body.description];
        //     const gitlinks = Array.isArray(req.body.gitlink) ? req.body.gitlink : [req.body.gitlink];
        //     const livelinks = Array.isArray(req.body.livelink) ? req.body.livelink : [req.body.livelink];
        //     const numProjects = Math.max(titles?.length || 0, descriptions?.length || 0, gitlinks?.length || 0, livelinks?.length || 0, Array.isArray(projectImages) ? projectImages.length : 1);

        //     for (let i = 0; i < numProjects; i++) {
        //         projectsToSave[i] = {};
        //         if (titles[i]) projectsToSave[i].title = titles[i];
        //         if (descriptions[i]) projectsToSave[i].description = descriptions[i];
        //         if (gitlinks[i]) projectsToSave[i].gitlink = gitlinks[i];
        //         if (livelinks[i]) projectsToSave[i].livelink = livelinks[i];
                
        //         if (Array.isArray(projectImages) && projectImages[i]) {
        //             projectsToSave[i].image = projectImages[i].filename;
        //         } else if (!Array.isArray(projectImages) && i === 0) {
        //             projectsToSave[i].image = projectImages.filename;
        //         }
        //     }
        } else {
            if (req.body.projects && Array.isArray(req.body.projects)) {
                projectsToSave = req.body.projects;
            } else if (req.body.title || req.body.description || req.body.gitlink || req.body.livelink) {
                projectsToSave = [req.body];
            }
        }

        if (projectsToSave.length === 0) {
            return res.status(400).json({ error: 'No project data provided' });
        }

        const savedProjects = await Project.insertMany(projectsToSave);

        res.json({ message: `${savedProjects.length} projects saved successfully`, projects: savedProjects });
    } catch (err) {
        // console.error("ERROR in postProject:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { postProject, getProject };