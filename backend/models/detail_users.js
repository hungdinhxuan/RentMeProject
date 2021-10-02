const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetailUsersSchema = new Schema(
  {
    nickname: { type: 'string', default: '' },
    desc: { type: 'string', default: '' },
    user_id: { type: mongoose.Types.ObjectId, refs: 'users' },
    birthDate: { type: Date },
    following: [mongoose.Types.ObjectId],
    follower: [mongoose.Types.ObjectId],
    blockList: [mongoose.Types.ObjectId],
    province: { type: 'string', default: 'Hồ Chí Minh' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('details_users', DetailUsersSchema);
