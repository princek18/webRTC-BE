const Mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const UserSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
  },
  socketId: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password can not contain 'password'");
      }
    },
  },
});

//This method runs while sending response.
UserSchema.methods.toJSON = function () {
  const user = this;
  const dataObject = user.toObject();

  delete dataObject.password;

  return dataObject;
};

//This function runs before saving data to database.
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
  next();
});

const UsersModel = Mongoose.model("users", UserSchema);

module.exports = UsersModel;
