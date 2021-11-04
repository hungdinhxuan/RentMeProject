const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

function minimumLimit(val) {
  return val.length > 0;
}

const PlayerProfilesSchema = new Schema(
  {
    nickname: { type: String, require: true },
    shortDesc: { type: String, default: '', maxLength: 255, required: true },
    longDesc: { type: String, default: '', maxLength: 2000 },
    userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    coverBackground: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    recordVoiceUrl: { type: String, default: '' },
    albums: {
      type: [String],
      validate: [minimumLimit, 'Khong the nho hon hoac bang 0'],
    },
    timeCanReceive: {
      type: [Number],
      validate: [minimumLimit, 'Khong the nho hon hoac bang 0'],
    },
    status: {
      type: String,
      default: 'Under Review',
      enum: ['Accepted', 'Under Review', 'Banned'],
    },
    services: {
      type: [{type: mongoose.Types.ObjectId, ref: 'services'}],
      validate: [minimumLimit, 'Khong the nho hon hoac bang 0'],
    },
  },
  { timestamps: true , versionKey: false },
);

PlayerProfilesSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  deletedAt: true,
});

module.exports = mongoose.model('player_profiles', PlayerProfilesSchema);
