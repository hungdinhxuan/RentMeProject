const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema(
  {
    senderId: { type: mongoose.Types.ObjectId, ref: 'users' },
    receiverId: { type: mongoose.Types.ObjectId, ref: 'users' },
    content: { type: String, maxLength: 3000 },
    tradingId: {type: mongoose.Types.ObjectId, ref: 'tradings'}
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model('messages', MessagesSchema);
