const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users.model');

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
  const transact = this;
  
  try {
    
    const user = await User.findById(
      transact.userId,
     
    )

    if (transact.type === 'withdraw') {
      if (user.balance < transact.money) {
        throw new Error(
          `Cannot withdraw with money greater than balance (current balance: ${user.balance})`,
        );
      }
      if (transact.money <= 0) {
        throw new Error(`Cannot withdraw with zero or negative money`);
      }
      user.balance = user.balance - transact.money;
      transact.money = -transact.money;
      user.save();
    } else if (transact.type === 'deposit') {
      if (transact.money > 1000) {
        throw new Error(`Maximum deposit is 1000$`);
      }
      if (transact.money <= 0) {
        throw new Error(`Cannot deposit with zero or negative money`);
      }
      user.balance = user.balance + transact.money;
      user.save();
    }
    
    next();
  } catch (error) {
    
    next(error);
  }
});
module.exports = mongoose.model('transactions', TransactionsSchema);
