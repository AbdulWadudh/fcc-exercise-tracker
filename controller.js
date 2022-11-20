const moment = require("moment");

const UserModel = require("./models/user");
const ExerciseModel = require("./models/exercise");

const createUser = async (req, res) => {
  const { username } = req.body;

  const userExists = await UserModel.findOne({ username }).lean();

  if (userExists) return res.send(`${username} already taken. Please try with different one!`);

  const newUser = new UserModel({ username });
  const response = await newUser.save();

  res.json({ username, username, _id: response._id });
};

const getUsers = async (req, res) => {
  const allUsers = await UserModel.find({}).lean();

  if (!allUsers) return res.send(`No Users Found`);

  res.json(allUsers);
};

const createExercies = async (req, res) => {
  const { userId } = req.params;
  let { description, duration } = req.body;
  // console.log("eq.body", req.body) 
  if (!description) description = "No description provided";
  if (!duration) duration = 0;
  const date = req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString();

  const user = await UserModel.findByIdAndUpdate(userId, { $push: { exercices: { description, duration, date } } }, { new: true }).lean();

  if (!user) return res.send(`Invalid User Id`);

  const newExercise = new ExerciseModel({ userId, description, duration, date });
  await newExercise.save();

  res.json({
    _id: userId,
    username: user.username,
    date, description, duration: parseInt(duration) ,
  });
};

const getAllExerciesByUserId = async (req, res) => {
  const { userId } = req.params;
  let { from, to, limit } = req.query;

  if (from === undefined) from = new Date(0);

  if (to === undefined) to = new Date();

  if (limit === undefined) limit = 0;
  else limit = parseInt(limit);

  const getExercies = await ExerciseModel.find({ userId, date: { $gte: from, $lte: to } })
    .sort({ date: -1 })
    .limit(limit)
    .lean();

  const getUser = await UserModel.findById({ _id: userId }).lean();

  if (!getExercies) return res.send(`No Exerciese Find for the Provided UserId`);

  const logs = getExercies?.map(({ description, duration, date }) => ({ description, duration: parseInt(duration), date: date.toDateString() }));

  res.json({ username: getUser?.username, count: getExercies?.length, log: logs });
};

module.exports = {
  createUser,
  getUsers,
  createExercies,
  getAllExerciesByUserId,
};
