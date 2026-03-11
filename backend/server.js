// require('dotenv').config({ quiet: true });
require("dotenv").config();

const express = require("express");
const connectDB = require("./connectDB");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const projectRoutes = require("./routes/projectsRoutes");
const UserRoutes = require("./routes/usersRoutes");
const workRoutes = require("./routes/workRoutes");

const app = express();
// MONGO_URI=mongodb+srv://sahil512sk_coc:$Rdx_tbijm_049@cluster0.9xdwln3.mongodb.net/
// PORT=3000
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// app.use(express.static("portfolio"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/projects", projectRoutes);
app.use("/users", UserRoutes);
app.use("/work", workRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed:", error);
  }
}

startServer();