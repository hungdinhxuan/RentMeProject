const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');

const ServicesSchema = new Schema(
  {
    name: { type: 'string' , maxLength: 255, null: false },
    desc: { type: 'string' , default: '', maxLength: 2000},
    picture: { type: 'string' , default: ''},
  },
  { timestamps: true, versionKey: false  },
);

ServicesSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  deletedAt: true,
});

module.exports = mongoose.model('services', ServicesSchema);
