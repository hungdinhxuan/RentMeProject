const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema(
  {
    senderId: { type: mongoose.Types.ObjectId, ref: 'users' },
    receiverId: { type: mongoose.Types.ObjectId, ref: 'users' },
    content: { type: String, maxLength: 3000, required: true},
    status: {
      type: String,
      default: 'unread',
      enum: ['unread', 'read'],
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model('messages', MessagesSchema);
