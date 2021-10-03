const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');



const UsersSchema = new Schema(
  {
    username: { type: 'string', required: true, minlength: 6, maxLength: 64, unique: true},
    email: { type: 'string', required: true, maxLength: 255, unique: true},
    password: { type: 'string', required: true },
    fullName: { type: 'string', required: true, maxLength: 255},
    gender: {
      type: 'string',
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    role: { type: Number, default: 3},
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
  deletedBy: true, 
  deletedByType: String
});



module.exports = mongoose.model('users', UsersSchema);
