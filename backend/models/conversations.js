const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationsSchema = new Schema(
  {
    senderId: { type: mongoose.Types.ObjectId, refs: 'users' },
    receiverId: { type: mongoose.Types.ObjectId, refs: 'users' },
    content: { type: String, maxLength: 3000 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('conversations', ConversationsSchema);
