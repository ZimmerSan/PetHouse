var User = require('./models/user');

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

function updateUserbyId(req, res) {
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

exports.createUser = createUser;
exports.getAllUsers = getAllUsers;

exports.getUserById = getUserById;
exports.updateUserbyId = updateUserbyId;
exports.deleteUserById = deleteUserById;