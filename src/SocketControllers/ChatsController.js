const ChatModel = require("../Models/ChatModel");
const ContactModel = require("../Models/ContactModel");
const UsersModel = require("../Models/UserModel");

const chatsController = (socket, user) => {
  //For getting chats data
  socket.on("get-chat", async (chatId) => {
    if (!chatId) {
      return socket.emit("error", { message: "Please provide chatId" });
    }
    try {
      let chats = await ChatModel.findOne({ _id: chatId });
      socket.emit("receive-chat", { data: chats.chats, chatId });
    } catch (e) {
      socket.emit("error", { message: e.message });
    }
  });

  //For sending message
  socket.on("send", async (data) => {
    if (!data.chatId || !data.data) {
      socket.emit("error", { message: "Invalid data!" });
    }
    try {
      let chats = await ChatModel.findOne({ _id: data.chatId });
      let receiver;
      if (chats.user1 === user.userName) {
        receiver = await UsersModel.findOne({ userName: chats.user2 });
      } else {
        receiver = await UsersModel.findOne({ userName: chats.user1 });
      }

      chats.chats.push(data.data);
      await chats.save();
      socket.emit("receive-chat", {
        data: chats.chats,
        chatId: data.chatId,
      });
      socket.to(receiver.socketId).emit("receive-chat", {
        data: chats.chats,
        chatId: data.chatId,
      });
    } catch (e) {
      socket.emit("error", { message: e.message });
    }
  });
};

module.exports = chatsController;
