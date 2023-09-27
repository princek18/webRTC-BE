const Mongoose = require("mongoose");

const ChatsModel = new Mongoose.Schema({
  chats: {
    type: [],
    required: true,
  },
  user1: {
    type: String,
    required: true,
  },
  user2: {
    type: String,
  },
});

const ChatModel = Mongoose.model("chats", ChatsModel);

module.exports = ChatModel;
