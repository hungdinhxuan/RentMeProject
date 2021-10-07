const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');
const { ListCities } = require('../utils/config');

const UsersSchema = new Schema(
  {
    username: {
      type: 'string',
      required: true,
      minlength: 6,
      maxLength: 64,
      unique: true,
    },
    email: { type: 'string', required: true, maxLength: 255, unique: true },
    password: { type: 'string', required: true },
    fullName: { type: 'string', required: true, maxLength: 255 },
    gender: {
      type: 'string',
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    role: { type: Number, default: 3, required: true },
    avatar: { type: 'string', default: '', maxLength: 500 },
    balance: { type: Number, default: 0 },
    nickname: { type: 'string', default: '' },
    desc: { type: 'string', default: '', maxLength: 1000 },
    isOnline: { type: Boolean, default: false, required: true },
    birthDate: { type: Date, default: '2000-01-01', required: true },
    following: [{type: mongoose.Types.ObjectId, ref: "users"}]  ,
    follower: [{type: mongoose.Types.ObjectId, ref: "users"}]  ,
    blockList: [{type: mongoose.Types.ObjectId, ref: "users"}] ,
    province: {
      type: 'string',
      default: 'Hồ Chí Minh',
      enum: ListCities,
      required: true,
    },
  },
  { timestamps: true },
);

UsersSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
});

module.exports = mongoose.model('users', UsersSchema);
