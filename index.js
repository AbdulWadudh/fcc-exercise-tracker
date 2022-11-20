require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { createUser, getUsers, createExercies, getAllExerciesByUserId } = require("./controller");

const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Middleware for Error Handling
app.use((err, req, res, next) => {
  let errCode;
  let errMessage;

  if (err.errors) {
    //mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    //report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    //generic custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res.status(errCode).type("txt").send(errMessage);
});

app.post("/api/users", (req, res) => createUser(req, res)).get("/api/users", (req, res) => getUsers(req, res));
app.post("/api/users/:userId/exercises", (req, res) => createExercies(req, res));
app.get("/api/users/:userId/logs", (req, res) => getAllExerciesByUserId(req, res));

const listener = app.listen(process.env.PORT || 4000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
