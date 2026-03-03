require('dotenv').config({ quiet: true });

const express = require("express");
const connectDB = require("./connectDB");
const multer = require("multer");
const cors = require('cors');   // To allow requests from frontend
const bodyParser = require('body-parser');
const path = require("path");
const projectRoutes = require('./routes/projectRoutes');
const UserRoutes = require('./routes/usersRoutes');
const app = express();
const dotenv = require("dotenv");
dotenv.config();
// MONGO_URI=mongodb+srv://sahil512sk_coc:Rdx_tbijm_049@cluster0.9xdwln3.mongodb.net/
// PORT=3000
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("portfolio"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/projects', projectRoutes);
app.use('/users', UserRoutes);




async function startServer() {
  const db = await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

startServer();