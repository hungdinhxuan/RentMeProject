const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');



const UsersSchema = new Schema(
  {
    username: { type: 'string', required: true, minlength: 5, maxLength: 64 },
    email: { type: 'string', required: true, maxLength: 255 },
    password: { type: 'string', required: true },
    fullName: { type: 'string', required: true, maxLength: 255},
    gender: {
      type: 'string',
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    roleId: { type: Number, ref: 'roles', default: 4},
    avatar: { type: 'string', default: '' },
    balance: { type: Number, default: 0 },
    isOnline: { type: Boolean, default: false },
    // status: {
    //   type: 'string',
    //   enum: ['busy', 'not ready'],
    //   default: 'not ready',
    // },
  },
  { timestamps: true },
);

UsersSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  deletedAt: true,
});



module.exports = mongoose.model('users', UsersSchema);
