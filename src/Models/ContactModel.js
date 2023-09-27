const Mongoose = require("mongoose");

const contactsSchema = {
  chatId: Mongoose.Types.ObjectId,
  userId: Mongoose.Types.ObjectId,
  name: String,
  userName: String,
  lastMessage: String,
  lastActive: String,
};

const ContactsModel = new Mongoose.Schema({
  userId: {
    type: Mongoose.Types.ObjectId,
    required: true,
  },
  contacts: {
    type: [contactsSchema],
    required: true,
  },
});

const ContactModel = Mongoose.model("contacts", ContactsModel);

module.exports = ContactModel;
