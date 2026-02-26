require('dotenv').config({ quiet: true });
require("./connectDB");

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./connectDB");

dotenv.config();
// MONGO_URI=mongodb+srv://sahil512sk_coc:Rdx_tbijm_049@cluster0.9xdwln3.mongodb.net/
// PORT=3000
const app = express();
app.use(express.json());
app.use(express.static("portfolio"));
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "portfolio/assets/pdf"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

async function startServer() {
  const db = await connectDB();

  app.get("/users", async (req, res) => {
    try {
      const users = await db.collection("users").find().toArray();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
    }
  });

  app.post("/api/portfolio", upload.single("cv"), async (req, res) => {
    try {
      const { name, role, email, about, skills } = req.body;
      let skillsArr = skills;
      if (typeof skills === "string") {
        skillsArr = skills.split(",").map(s => s.trim()).filter(Boolean);
      }
      const portfolioData = {
        name,
        role,
        email,
        about,
        skills: skillsArr,
        cv: req.file ? `/assets/pdf/${req.file.filename}` : null,
        createdAt: new Date()
      };
      await db.collection("portfolio").insertOne(portfolioData);
      res.status(201).json({ message: "Portfolio saved" });
    } catch (err) {
      console.error("Portfolio save error:", err);
      res.status(500).json({ error: "Failed to save portfolio" });
    }
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
}

startServer();
