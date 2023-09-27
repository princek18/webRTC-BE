const UsersModel = require("../src/Models/UserModel");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const authUser = async (userName, password) => {
  const user = await UsersModel.findOne({ userName });
  if (!user) {
    throw new Error("Username not found!");
  }
  const match = await bcryptjs.compare(password, user.password);
  if (!match) {
    throw new Error("Incorrect Password!");
  }
  return user;
};

const getAuthToken = async (user) => {
  const token = jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2 weeks",
  });
  return token;
};

const authToken = async (req, res, next) => {
  try {
    if (!req.header("authToken").includes("ChAp")) {
      throw new Error();
    }
    const token = req.header("authToken").replace("ChAp ", "");
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await UsersModel.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ message: "Authentication Failed." });
  }
};

module.exports = {
  authToken,
  authUser,
  getAuthToken,
};
