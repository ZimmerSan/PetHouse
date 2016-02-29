var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var imgSchema = new Schema({
    img: {
        data        : Buffer,
        contentType : String
    }
});

module.exports = mongoose.model('Img', imgSchema);