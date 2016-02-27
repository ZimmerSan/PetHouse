var User = require('./models/user');
var Post = require('./models/post');

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

function createPost(req, res) {
    //console.log(req.body, "body");
    var post                    = new Post();
    post.pet.name               = req.body.name;
    //TODO: image
    post.pet.species            = req.body.species;
    post.pet.breed              = req.body.breed;
    post.pet.sex                = req.body.sex;
    post.pet.location           = req.body.location;
    post.pet.att_to_children    = req.body.att_to_children;
    post.pet.character          = req.body.character;
    post.pet.vaccinations       = req.body.vaccinations;
    post.pet.other              = req.body.other;

    post.system.created_at      = Date.now();
    post.system.status          = "New";

    // save the user and check for errors
    post.save(function (err) {
        if (err) res.send(err);
        res.json({
            message : 'Post created!',
            post    : post,
            user    : req.user
        });
    });
}

function getAllPosts(req, res) {
    Post.find(function (err, posts) {
        if (err) res.send(err);
        res.json(posts);
    });
}

function getPostById(req, res) {
    Post.findById(req.params.post_id, function (err, post) {
        if (err) res.send(err);
        res.json(post);
    });
}

exports.createUser = createUser;
exports.getAllUsers = getAllUsers;

exports.getUserById = getUserById;
exports.updateUserById = updateUserById;
exports.deleteUserById = deleteUserById;

exports.createPost = createPost;
exports.getAllPosts = getAllPosts;

exports.getPostById = getPostById;