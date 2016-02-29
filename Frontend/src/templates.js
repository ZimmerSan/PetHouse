var fs = require('fs');
var ejs = require('ejs');

exports.Pet_Short = ejs.compile(fs.readFileSync('./Frontend/templates/pet_short.ejs', "utf8"));