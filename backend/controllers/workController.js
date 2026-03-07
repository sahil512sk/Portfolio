const Work = require('../models/workModel');

const postWork = async (req, res) => {
  try {
    const { work } = req.body;
    
    if (!work || !Array.isArray(work)) {
      return res.status(400).json({ error: 'Work data is required and must be an array' });
    }

    // Work.deleteMany({}); do not delete existing data, just add new data to the database
    const workExperiences = await Work.insertMany(work);
    
    res.status(201).json({
      message: 'Work experiences saved successfully',
      data: workExperiences
    });
  } catch (error) {
    // console.error('Error saving work experiences:', error);
    res.status(500).json({ error: 'Failed to save work experiences' });
  }
};

const getWork = async (req, res) => {
  try {
    const workExperiences = await Work.find().sort({ start_date: -1 });
    res.status(200).json(workExperiences);
  } catch (error) {
    // console.error('Error fetching work experiences:', error);
    res.status(500).json({ error: 'Failed to fetch work experiences' });
  }
};

module.exports = {
  postWork,
  getWork
};
