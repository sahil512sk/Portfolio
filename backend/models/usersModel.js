const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: false,
      match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please enter a valid email address'],
    },
    whatsapp: {
      type: String,
      required: false,
    },
    github: {
      type: String,
      required: false,
    },
    cv: {
      type: String,
      required: false,
    },
    frontend: {
      type: [String],
      default: [],
    },
    backend: {
      type: [String],
      default: [],
    },
    tools: {
      type: [String],
      default: [],
    },
    about: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', usersSchema);