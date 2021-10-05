const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const PlayerProfilesSchema = new Schema(
  {
    nickname: { type: String, require: true },
    shortDesc: { type: String, default: '', maxLength: 255, required: true},
    longDesc: { type: String, default: '', maxLength: 2000 },
    userId: { type: mongoose.Types.ObjectId, refs: 'users' },
    coverBackground: { type: String, required: true},
    pricePerHour: { type: Number },
    recordVoiceUrl: { type: String, default: '' },
    albums: [String],
    timeCanReceive: [Number],
    status: { 
      type: String,
      default: 'Under Review',
      enum: ['Accepted', 'Rejected', 'Under Review'],
    },
  },
  { timestamps: true },
);

PlayerProfilesSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  deletedAt: true,
});

module.exports = mongoose.model('player_profiles', PlayerProfilesSchema);
