var User    = require('./models/user');
var Pet     = require('./models/pet');
var Img     = require('./models/img');
var fs      = require('fs');
var nodemailer  = require('nodemailer');
var mail_config = require('../config/mail');
var transporter = nodemailer.createTransport(mail_config.smtpConfig);
// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
        var mailData = {
            from: "togoodhands@yandex.ru",
            to: "paultsimura@gmail.com",
            subject: "Pet subject",
            text: "Hello. This is a test message"
        }
        transporter.sendMail(mailData, function(err, info){
            if(err) console.log("Err",err);
            console.log("info:",info);
        });
    }
});

var DEFAULT_IMAGE = '0000000000';

function createUser(req, res) {
    var user = new User();      // create a new instance of the User model
    user.name = req.body.name;  // set the users name (comes from the request)

    // save the user and check for errors
    user.save(function (err) {
        if (err) res.send(err);
        res.json({message: 'User created!'});
    });
}

function getAllUsers(req, res) {
    User.find(function (err, users) {
        if (err) res.send(err);
        res.json(users);
    });
}

function getUserById(req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (err) res.send(err);
        res.json(user);
    });
}

function updateUserById(req, res) {
    // use our user model to find the user we want
    User.findById(req.params.user_id, function (err, user) {

        if (err) res.send(err);
        user.name = req.body.name;  // update the users info

        // save the user
        user.save(function (err) {
            if (err) res.send(err);
            res.json({message: 'User updated!'});
        });

    });
}

function deleteUserById(req, res) {
    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err) res.send(err);
        res.json({ message: 'Successfully deleted' });
    });
}

function createPet(req, res) {
    var pet                    = new Pet();
    pet.pet.name               = req.body.form.name;
    if (req.body.file)  pet.pet.img = req.body.file;
    else                pet.pet.img = DEFAULT_IMAGE;
    pet.pet.species            = req.body.form.species;
    pet.pet.breed              = req.body.form.breed;
    pet.pet.sex                = req.body.form.sex;
    pet.pet.location           = req.body.form.location;
    pet.pet.att_to_children    = req.body.form.att_to_children;
    pet.pet.character          = req.body.form.character;
    pet.pet.vaccinations       = req.body.form.vaccinations;
    pet.pet.other              = req.body.form.other;

    pet.system.created_at      = Date.now();
    pet.system.updated_at      = Date.now();
    pet.system.status          = "New";
    pet.system.author          = req.body.user._id;

    // save the pet and check for errors
    pet.save(function (err) {
        if (err) res.send(err);
        else res.json({
            message : 'Pet created!',
            pet     : pet,
            user    : req.body.user
        });
    });
}

function getAllPets(req, res) {
    Pet.find(function (err, pets) {
        if (err) res.send(err);
        res.json(pets);
    });
}

function getPetById(req, res) {
    Pet.findById(req.params.pet_id, function (err, pet) {
        if (err)    res.send(err);
        else        res.json(pet);
    });
}

function getPetsByAuthor(req, res) {
    Pet.find({ 'system.author' : req.params.author_id },function (err, pets) {
        if (err) res.send(err);
        res.json(pets);
    });
}

//todo upload images to remote storage
function uploadImg(req, res) {
    var fs      = require('fs');
    var Img     = require('../../Backend/app/models/img.js');
    var imgPath = req.body.filepath;

    var a = new Img;
    a.img.data = fs.readFileSync(imgPath);
    a.img.contentType = 'image/png';
    a.save(function (err, a) {
        if (err) throw err;
        console.error(a);
        console.error('saved img to mongo');
        res.json(a._id);
    });
}

function getImgById(req, res) {
    Img.findById(req.params.img_id, function (err, doc) {
        if (err) return next(err);
        res.contentType(doc.img.contentType);
        res.send(doc.img.data);
    });
}

//todo: complete this function
function updatePetById(req, res) {
    var data = req.body;
    console.log("data:", data);
    Pet.findById(req.params.pet_id, function (err, pet) {
        if (err)    res.send(err);
        else {
            pet.pet.name               = data.form.name;
            if (data.file)      pet.pet.img = data.file;
            else                pet.pet.img = DEFAULT_IMAGE;
            pet.pet.species            = data.form.species;
            pet.pet.breed              = data.form.breed;
            pet.pet.sex                = data.form.sex;
            pet.pet.location           = data.form.location;
            pet.pet.att_to_children    = data.form.att_to_children;
            pet.pet.character          = data.form.character;
            pet.pet.vaccinations       = data.form.vaccinations;
            pet.pet.other              = data.form.other;

            pet.system.updated_at      = Date.now();
            pet.system.status          = data.form.status;

            // save the pet and check for errors
            pet.save(function (err) {
                if (err) res.send(err);
                else res.json({
                    message : 'Pet updated!',
                    pet     : pet,
                    user    : data.user
                });
            });
        };
    });
}

function sendMessage(req, res){

}

exports.createUser      = createUser;
exports.getAllUsers     = getAllUsers;
exports.getUserById     = getUserById;
exports.updateUserById  = updateUserById;
exports.deleteUserById  = deleteUserById;

exports.createPet       = createPet;
exports.getAllPets      = getAllPets;
exports.getPetById      = getPetById;
exports.updatePetById   = updatePetById;
exports.getPetsByAuthor = getPetsByAuthor;

exports.uploadImg       = uploadImg;
exports.getImgById      = getImgById;