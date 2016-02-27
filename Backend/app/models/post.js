var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var postSchema = new Schema({
    pet                 :{
        name            : String,
        img             : { data : Buffer, contentType : String },
        species         : { type : String, required    : true },
        breed           : String,
        sex             : String,
        location        : String,
        att_to_children : String,
        character       : String,
        vaccinations    : String,
        other           : String
    },
    system              : {
        author          : String,
        status          : String,
        updated_at      : Date,
        created_at      : Date
    }
});

// methods ======================
postSchema.methods.changeStatus = function(status) {
    this.system.status = status;
    this.system.updated_at = Date.now();
    return this.system.status;
};

module.exports = mongoose.model('Post', postSchema);