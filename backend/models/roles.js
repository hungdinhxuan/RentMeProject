const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const RolesSchema = new Schema(
  {
    _id: { type: Number, unique: true, primaryKey: true, min: 0, max: 255 },
    name: { type: 'string' , default: ''},
    desc: { type: 'string' , default: ''},
  },
  { timestamps: true },
);

RolesSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  deletedAt: true,
});

module.exports = mongoose.model('roles', RolesSchema);
