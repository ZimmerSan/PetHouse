var fs = require('fs');
var ejs = require('ejs');

exports.Post_Short = ejs.compile(fs.readFileSync('./Frontend/templates/post_short.ejs', "utf8"));