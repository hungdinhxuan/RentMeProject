const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TradingsSchema = new Schema(
  {
    renterId: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    playerId: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    money: { type: Number, required: true },
    time: { type: Number, required: true },
    status: {
      type: String,
      enum: ['aborted', 'pending', 'performing', 'done'],
    },
    content: {type: String, maxlength: 500},
    expireIn: {type: Number, default: 20},
    idRoom: {type: String, required: true, maxlength: 255},
    roomPassword: {type: String, required: true, maxlength: 255}
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('tradings', TradingsSchema);
