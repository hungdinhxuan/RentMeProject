const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionsSchema = new Schema(
  {
    
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    type: {type: String, enum: ['deposit', 'withdraw']},
    payment_id: { type: mongoose.Types.ObjectId, ref: 'payments'},
    money: {type: Number, default: 0}
  },
  { timestamps: true, versionKey: false  },
);

module.exports = mongoose.model('transactions', TransactionsSchema);
