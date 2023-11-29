require("dotenv").config();const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const Project = require("../models/project");
const Auth = require("../models/auth");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

app.get("/", (_req, res) => {
  res.send("App Working");
});

app.get("/api/projects", async (_req, res) => {
  try {
    const projects = await Project.find().sort({ _id: -1 });
    res.json(projects);
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/projects", async (req, res) => {
  let { auth, ...data } = req.body;

  if (!auth) {
    res.status(403).json({ message: "Missing authentication details" });
  }
  try {
    let userData = await Auth.findOne({ user: auth.user });
    if (!userData)
      return res
        .status(403)
        .json({ message: "Incorrect authentication details" });
    const authenticated = bcrypt.compareSync(auth.password, userData.password);
    if (authenticated) {
      const project = new Project(data);
      const savedProject = await project.save();
      return res.status(201).json(savedProject);
    } else {
      res.status(403).json({ message: "Incorrect authentication details" });
    }
  } catch (err) {
    console.log(err);
    res.status(403);
  }
});

/* create admin user
app.post("/api/users", (req, res) => {
  const hashpw = bcrypt.hashSync(req.body.password, 12);
  let user = new Auth({ user: req.body.user, password: hashpw });
  user
    .save()
    .then(() => res.status(201))
    .catch((err) => console.log(err));
});
*/

let PORT = process.env.PORT || 3800;
app.listen(PORT, () => console.log("listening on " + PORT));
