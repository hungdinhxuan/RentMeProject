const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const PlayerProfilesSchema = new Schema(
  {
    nickname: { type: 'string',require: true },
    shortDesc: { type: 'string', default: '' , maxLength: 255},
    longDesc: { type: 'string', default: '' , maxLength: 2000},
    userId: { type: mongoose.Types.ObjectId, refs: 'users' },
    pricePerHour: { type: Number},
    recordVoiceUrl: { type: 'string', default: '' },
    albums: [String],
    avatar: { type: 'string', default: ''},
    timeCanReceive: [Number],

  },
  { timestamps: true },
);

PlayerProfilesSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  deletedAt: true,
});

module.exports = mongoose.model('player_profiles', PlayerProfilesSchema);
