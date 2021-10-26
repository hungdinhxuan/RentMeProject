const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');


const StreamHubSchema = new Schema({
    userId: {type: mongoose.Types.ObjectId, ref: "users", required: true},
    secretKey: {type: String, maxlength: 100},
}, { timestamps: true, versionKey: false });

StreamHubSchema.plugin(mongoose_delete, {
  overrideMethods: 'all',
  deletedAt: true,
});

module.exports = mongoose.model('stream_hub', StreamHubSchema);
