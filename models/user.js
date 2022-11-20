const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: false },
  count: { type: Number },
  exercices: [
    {
      description: { type: String },
      duration: { type: Number },
      date: { type: String, required: false },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
