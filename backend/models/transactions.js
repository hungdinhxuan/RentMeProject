const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionsSchema = new Schema(
  {
    
    userId: { type: mongoose.Types.ObjectId, refs: 'users' },
    type: {type: String, enum: ['deposit', 'withdraw']},
    payment_id: { type: mongoose.Types.ObjectId, refs: 'payments'},
    money: {type: Number, default: 0}
  },
  { timestamps: true },
);

module.exports = mongoose.model('transactions', TransactionsSchema);
