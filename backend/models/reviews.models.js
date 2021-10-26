const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewsSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'users' , required: true},
    playerProfileId: { type: mongoose.Types.ObjectId, ref: 'player_profiles',  required: true},
    content: { type: String, maxLength: 3000 },
    rating: { type: Number, max: 5, min: 1, default: 5 },
    tradingId: { type: mongoose.Types.ObjectId, ref: 'tradings', required: true},
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model('reviews', ReviewsSchema);
