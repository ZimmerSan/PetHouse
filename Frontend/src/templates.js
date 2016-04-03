var fs = require('fs');
var ejs = require('ejs');

exports.Pet_Short = ejs.compile(fs.readFileSync('./Frontend/templates/pet_short.ejs', "utf8"));
exports.Pet_Full = ejs.compile(fs.readFileSync('./Frontend/templates/pet_full.ejs', "utf8"));
exports.Pet_Edit = ejs.compile(fs.readFileSync('./Frontend/templates/pet_edit.ejs', "utf8"));
