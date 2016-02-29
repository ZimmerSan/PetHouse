var User = require('./models/user');
var Pet = require('./models/pet');

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
    //console.log(req.body, "body");
    var pet                    = new Pet();
    pet.pet.name               = req.body.name;
    //TODO: image
    pet.pet.species            = req.body.species;
    pet.pet.breed              = req.body.breed;
    pet.pet.sex                = req.body.sex;
    pet.pet.location           = req.body.location;
    pet.pet.att_to_children    = req.body.att_to_children;
    pet.pet.character          = req.body.character;
    pet.pet.vaccinations       = req.body.vaccinations;
    pet.pet.other              = req.body.other;

    pet.system.created_at      = Date.now();
    pet.system.status          = "New";

    // save the user and check for errors
    pet.save(function (err) {
        if (err) res.send(err);
        res.json({
            message : 'Pet created!',
            pet    : pet,
            user    : req.user
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
    Pet.find({ 'system.author' : req.user._id },function (err, pets) {
        if (err) res.send(err);
        res.json(pets);
    });
}



exports.createUser  = createUser;
exports.getAllUsers = getAllUsers;

exports.getUserById     = getUserById;
exports.updateUserById  = updateUserById;
exports.deleteUserById  = deleteUserById;

exports.createPet   = createPet;
exports.getAllPets  = getAllPets;

exports.getPetById  = getPetById;

exports.getPetsByAuthor = getPetsByAuthor;