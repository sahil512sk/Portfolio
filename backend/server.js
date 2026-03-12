require('dotenv').config();
if (!process.env.MONGO_URI) {
  console.log("server")
  process.env.MONGO_URI = 'mongodb+srv://sahil512sk_coc:Rdx_tbijm_049@cluster0.9xdwln3.mongodb.net/';
}
if (!process.env.PORT) {
  console.log(".js")
  process.env.PORT = '3000';
}

// # Database
// MONGO_URI=mongodb+srv://sahil512sk_coc:Rdx_tbijm_049@cluster0.9xdwln3.mongodb.net/
// PORT=3000

const express = require("express");
const connectDB = require("./connectDB");
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");
const projectRoutes = require('./routes/projectsRoutes');
const UserRoutes = require('./routes/usersRoutes');
const workRoutes = require('./routes/workRoutes');
const app = express();

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/projects', projectRoutes);
app.use('/users', UserRoutes);
app.use('/work', workRoutes);
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function startServer() {
  const db = await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

startServer();