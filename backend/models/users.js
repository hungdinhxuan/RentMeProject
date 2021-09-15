const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');


const UsersSchema = new Schema(
  {
    username: { type: 'string', required: true, minlength: 5, maxLength: 32 },
    email: { type: 'string', required: true, maxLength: 255 },
    password: { type: 'string', required: true },
    fullName: { type: 'string', required: true },
    gender: {
      type: 'string',
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    role_id: { type: Number, ref: 'roles', default: 4},
    avatar: { type: 'string', default: '' },
    balance: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    status: {
      type: 'string',
      enum: ['active', 'inactive', 'busy', 'not ready'],
      default: 'inactive',
    },
  },
  { timestamps: true },
);

UsersSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  deletedAt: true,
});

module.exports = mongoose.model('users', UsersSchema);
