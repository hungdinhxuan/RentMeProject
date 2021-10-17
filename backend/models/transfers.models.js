const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransfersSchema = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    receiver: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    money: { type: Number, required: true },
    status: {
      type: String,
      enum: ['donate', 'tradings'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('transfers', TransfersSchema);
