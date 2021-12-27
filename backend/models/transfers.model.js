const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users.model');

const TransfersSchema = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    receiver: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    money: { type: Number, required: true },
    type: {
      type: String,
      enum: ['donate', 'trade'],
      required: true,
    },
    tradingId: { type: mongoose.Types.ObjectId, ref: 'users' },
    profit: { type: Number, default: 0 },
    rate: { type: Number, default: 0.05 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

TransfersSchema.pre('save', async function (next) {
  const transfer = this;
  const sesssion = await mongoose.startSession();
  try {
    sesssion.startTransaction();

    const sender = await User.findById(transfer.sender, null, {
      session: sesssion,
    });
    const receiver = await User.findById(transfer.receiver, null, {
      session: sesssion,
    });
    const system = await User.findOne({ username: 'system' }, null, {
      session: sesssion,
    });
    if (transfer.type === 'donate') {
      if (sender.balance < transfer.money) {
        throw new Error(
          `Cannot donate with money greater than current balance`,
        );
      }
      if (transfer.money <= 0) {
        throw new Error(`Cannot donate with zero or negative money`);
      }
      const profit = transfer.money * transfer.rate;
      system.balance += profit;

      transfer.money -= profit;
      transfer.profit = profit;

      sender.balance = sender.balance - transfer.money;
      receiver.balance = receiver.balance + transfer.money;

      await system.save();
    } else if (transfer.type === 'trade') {
      if (sender.balance < transfer.money) {
        throw new Error(`Cannot trade with money greater than current balance`);
      }
      if (transfer.money <= 0) {
        throw new Error(`Cannot trade with zero or negative money`);
      }

      if (!transfer.tradingId) {
        throw new Error(`Trading Code is not valid !!`);
      }

      sender.balance = sender.balance - transfer.money;
      receiver.balance = receiver.balance + transfer.money;
    }
    await sender.save();
    await receiver.save();
    await sesssion.commitTransaction();
    sesssion.endSession();
    return next();
  } catch (error) {
    await sesssion.abortTransaction();
    sesssion.endSession();
    next(error);
  }
});

module.exports = mongoose.model('transfers', TransfersSchema);
