const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users.model')

const TransfersSchema = new Schema(
  {
    sender: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    receiver: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    money: { type: Number, required: true },
    type: {
      type: String,
      enum: ['donate', 'trade'],
      required: true
    },
    tradingId: {type: mongoose.Types.ObjectId, ref: "users"},
    profit: {type: Number, default: 0},
    rate: {type: Number, default: 0.05},
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

TransfersSchema.pre('save', async function (next) {
  const transfer = this;
  try {
    const sender = await User.findById(transfer.sender);
    const receiver = await User.findById(transfer.receiver);
    const system = await User.findOne({ username: 'system' });
    if (transfer.type === 'donate') {
      if (sender.balance < transfer.money) {
        next(new Error(`Cannot donate with money greater than current balance`));
        return;
      }
      if(transfer.money <= 0){
        next(new Error(`Cannot donate with zero or negative money`));
        return;
      }
      const profit = transfer.money * transfer.rate;
      system.balance += profit;

      transfer.money -= profit;
      transfer.profit = profit;
      
      sender.balance = sender.balance - transfer.money;
      receiver.balance = receiver.balance + transfer.money

      sender.save();
      receiver.save()
      system.save();
      return next();
    } else if (transfer.type === 'trade') {
      if (sender.balance < transfer.money) {
        next(new Error(`Cannot trade with money greater than current balance`));
        return;
      }
      if(transfer.money <= 0){
        next(new Error(`Cannot trade with zero or negative money`));
        return;
      }

      if(!transfer.tradingId){
        next(new Error(`Trading Code is not valid !!`));
        return;
      }

      sender.balance = sender.balance - transfer.money;
      receiver.balance = receiver.balance + transfer.money
      
      sender.save();
      receiver.save()

      return next();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('transfers', TransfersSchema);
