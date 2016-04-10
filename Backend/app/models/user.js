var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
    status          : String,
    name            : String,
    email           : String,
    phone           : String,
    img             : String,
    facebook        : {
        id          : String,
        token       : String,
    },
    google          : {
        id          : String,
        token       : String,
    },
    vk              : {
        id          : String,
        token       : String,
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);