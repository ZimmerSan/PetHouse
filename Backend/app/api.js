var User    = require('./models/user');
var Pet     = require('./models/pet');
var Img     = require('./models/img');
var fs      = require('fs');

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
    //save image
    var img = new Img();
    img.img.data = fs.readFileSync(req.body.file.path);
    img.img.contentType = 'image/png';
    img.save();

    //fill the pet
    var pet                    = new Pet();
    pet.pet.name               = req.body.form.name;
    pet.pet.img                = img._id;
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
        if (err) res.send(err);
        res.json(pet);
    });
}

function getPetsByAuthor(req, res) {
    Pet.find({ 'system.author' : req.params.author_id },function (err, pets) {
        if (err) res.send(err);
        res.json(pets);
    });
}

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

    //todo: deal with clearing uploaded data
    // empty the collection
    //Img.remove(function (err) {
    //    if (err) throw err;
    //
    //    console.error('removed old docs');
    //
    //    // store an img in binary in mongo
    //    var a = new Img;
    //    a.img.data = fs.readFileSync(imgPath);
    //    a.img.contentType = 'image/png';
    //    a.save(function (err, a) {
    //        if (err) throw err;
    //        console.error(a);
    //        console.error('saved img to mongo');
    //        res.json(a._id);
    //    });
    //});
}

function getImgById(req, res) {
    Img.findById(req.params.img_id, function (err, doc) {
        if (err) return next(err);
        res.contentType(doc.img.contentType);
        //res.json(doc.img.data);
        //todo: don't lose
        res.send(doc.img.data);
    });
}

exports.createUser      = createUser;
exports.getAllUsers     = getAllUsers;
exports.getUserById     = getUserById;
exports.updateUserById  = updateUserById;
exports.deleteUserById  = deleteUserById;

exports.createPet       = createPet;
exports.getAllPets      = getAllPets;
exports.getPetById      = getPetById;
exports.getPetsByAuthor = getPetsByAuthor;

exports.uploadImg       = uploadImg;
exports.getImgById      = getImgById;