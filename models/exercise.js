const mongoose = require("mongoose");
const user = require("./user");

const exerciseSchema = new mongoose.Schema({
  userId: {
      type: String,
      required: true,
      ref: user
  },
  description: {
      type: String,
      required: true
  },
  duration: {
      type: Number,
      required: true
  },
  date: {
      type: Date,
      default: Date.now
  }
});

module.exports = mongoose.model("Exercise", exerciseSchema);