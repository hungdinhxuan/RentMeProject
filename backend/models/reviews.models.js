const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewsSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    playerId: { type: mongoose.Types.ObjectId, ref: 'users' },
    content: { type: String, maxLength: 3000 },
    ratings: { type: Number, max: 5, min: 1, default: 5 },
    tradingId: { type: mongoose.Types.ObjectId, ref: 'tradings' },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model('reviews', ReviewsSchema);
