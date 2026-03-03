// models/usersModel.js

const mongoose = require('mongoose');

// Define the user schema
const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please enter a valid email address'],
    },
    cv: {
      type: String,
      required: false, // File path for CV (optional)
    },
    skills: {
      type: [String],
      default: [],
    },
    about: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      required: false, // File path for avatar (optional)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', usersSchema);