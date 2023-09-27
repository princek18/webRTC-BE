const ChatModel = require("../Models/ChatModel");
const ContactModel = require("../Models/ContactModel");
const UsersModel = require("../Models/UserModel");
const jsonwebtoken = require("jsonwebtoken");
const contactsController = require("./ContactsController");
const chatsController = require("./ChatsController");

const socketController = async (socket) => {
  if (socket.handshake.query && socket.handshake.query.authToken) {
    let token = socket.handshake.query.authToken;
    token = token.replace("ChAp ", "");
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await UsersModel.findOne({ _id: decoded._id });

    if (!user) {
      socket.emit("error", { message: "Authentication Failed!" });
    }

    user.socketId = socket.id;
    await user.save();

    //Contacts-Controller
    contactsController(socket, user);

    //Chats-Controller
    chatsController(socket, user);
  } else {
    socket.emit("error", { message: "Authentication Failed!" });
  }
};

module.exports = socketController;
