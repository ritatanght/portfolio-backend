const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  repository: {
    type: String,
    required: true,
  },
  liveURL: String,
  screencast: String,
  image: String,
  tools: [{ type: String, required: true }],
});

module.exports = mongoose.model("Project", projectSchema);
