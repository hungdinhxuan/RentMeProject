const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');
const { ListCities } = require('../utils/config');

const UsersSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 6,
      maxLength: 64,
      unique: true,
    },
    email: { type: String, required: true, maxLength: 255, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true, maxLength: 255 },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    role: { type: Number, default: 3, required: true },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/rentme-store/image/upload/v1633703754/rentme/default-avatar_gfslso.png',
      maxLength: 500,
      required: true,
    },
    balance: { type: Number, default: 0 },
    nickname: { type: String, default: '' },
    desc: { type: String, default: '', maxLength: 1000 },
    isOnline: { type: Boolean, default: false, required: true },
    birthDate: { type: Date, default: '2000-01-01', required: true },
    following: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    follower: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    blockList: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    typeAccount: {
      type: String,
      default: 'local',
      required: true,
      enum: ['local', 'facebook', 'google'],
    },
    province: {
      type: String,
      default: 'Hồ Chí Minh',
      enum: ListCities,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

UsersSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
});

module.exports = mongoose.model('users', UsersSchema);
