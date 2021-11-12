const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationsSchema = new Schema(
  {
    senderId: { type: mongoose.Types.ObjectId, ref: 'users' },
    receiverId: { type: mongoose.Types.ObjectId, ref: 'users' },
    nicknameSender: {type: String, default: ""},
    nicknameReceiver: {type: String, default: ""},
    content: { type: String, maxLength: 3000, required: true },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model('conversations', ConversationsSchema);
