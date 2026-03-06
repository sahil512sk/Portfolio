const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    gitlink: {
        type: String,
        required: true,
    },
    livelink: {
        type: String,
        required: false,
    }
},
    {
        timestamps: true
    });
module.exports = mongoose.model('Project', projectSchema);