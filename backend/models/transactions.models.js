const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users.models');

const TransactionsSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    type: { type: String, enum: ['deposit', 'withdraw'], required: true },
    paymentMethod: {
      type: String,
      enum: ['momo', 'zalopay', 'visa'],
      required: true,
    },
    money: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

TransactionsSchema.pre('save', async function (next) {
  try {
    const user = await User.findById(transact.userId);
    if (transact.type === 'withdraw') {
      if (user.balance < transact.money) {
        next(new Error('Cannot withdraw with money greater than balance'));
        return;
      }
      user.balance = user.balance - transact.money;
      user.save();
      console.log(user.balance, transact.money);
      return next();
    } else if (transact.type === 'deposit') {
      user.balance = user.balance + transact.money;
      user.save();
      next();
    }
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('transactions', TransactionsSchema);
