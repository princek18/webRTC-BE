const ChatModel = require("../Models/ChatModel");
const ContactModel = require("../Models/ContactModel");
const UsersModel = require("../Models/UserModel");

const contactsController = (socket, user) => {
  //For getting contacts data
  socket.on("get-contacts", async () => {
    try {
      console.log("called get");
      let contacts = await ContactModel.findOne({ userId: user._id });
      socket.emit("receive-contacts", { data: contacts?.contacts || [] });
      console.log("called receive");
    } catch (e) {
      socket.emit("error", { message: e.message });
    }
  });

  //For adding contacts data
  socket.on("add-contact", async (data) => {
    if (!data?.userName) {
      return socket.emit("error", { message: "Please provide userName!" });
    }
    try {
      let userData = await UsersModel.findOne({ userName: data.userName });
      if (!userData) {
        throw new Error("No user found!");
      } else if (user.userName === data.userName) {
        throw new Error("Can not add yourself!");
      }
      let contacts = await ContactModel.findOne({ userId: user._id });
      let chat = await ChatModel.findOne({ user1: data.userName });
      if (!chat) {
        chat = new ChatModel({ chats: [], user1: user.userName, user2: "" });
      } else {
        chat.user2 = user.userName;
      }
      if (!contacts) {
        let contact = new ContactModel({
          userId: user._id,
          contacts: [
            {
              chatId: chat._id,
              userId: userData._id,
              name: userData.name,
              userName: userData.userName,
              lastMessage: "-",
              lastActive: "No Activity",
            },
          ],
        });
        await contact.save();
        await chat.save();
      } else {
        for (let i = 0; i < contacts.contacts.length; i++) {
          if (
            JSON.stringify(contacts.contacts[i].userId) ===
            JSON.stringify(userData._id)
          ) {
            throw new Error("User is already added!");
          }
        }
        contacts.contacts.push({
          chatId: chat._id,
          userId: userData._id,
          name: userData.name,
          userName: userData.userName,
          lastMessage: "-",
          lastActive: "No Activity",
        });
        await contacts.save();
        await chat.save();
      }
      socket.emit("add-contact-ack", { message: "User added!" });
    } catch (e) {
      socket.emit("error", { message: e.message });
    }
  });
};

module.exports = contactsController;
