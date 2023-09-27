const { Router } = require("express");
const { getAuthToken, authUser } = require("../../Utils/utils");
const UsersModel = require("../Models/UserModel");

const userRouter = new Router();

userRouter.post("/login", async (req, res) => {
  if (!req.body?.userName || !req.body?.password) {
    return res
      .status(404)
      .send({ message: "Please provide username and password." });
  }
  try {
    let authToken;
    const user = await authUser(req.body.userName, req.body.password);
    authToken = await getAuthToken(user);
    res.send({ user, authToken });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

userRouter.post("/signup", async (req, res) => {
  try {
    let data = await UsersModel.findOne({ userName: req.body.userName });
    if (data?.userName) {
      return res.status(400).send({ message: "username already registered!" });
    }
    const user = new UsersModel(req.body);
    await user.save();
    res.send({ message: "User Successfully Created!" });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = userRouter;
