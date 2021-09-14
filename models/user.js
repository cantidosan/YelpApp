const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
// uses the passport infrastructure to collect passwords instead of making it a default field
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

