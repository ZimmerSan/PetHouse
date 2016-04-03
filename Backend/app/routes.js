var flash   = require('connect-flash');
var api     = require('./api');
var request = require('request');
var multer  = require('multer');
var azure   = require('azure-storage');
var Img     = require('./models/img');
var API_URL = "http://localhost:5050";
var storage = require('../config/storage');

// Azure Storage init
var accessKey       = storage.accessKey;
var storageAccount  = storage.storageAccount;
var blobService     = azure.createBlobService(storageAccount, accessKey);
var containerName   = storage.containerName;

blobService.createContainerIfNotExists(containerName, {
    publicAccessLevel: 'blob'
}, function(error, result, response) {
    if (error) {
        console.log("Error while creating Container");
    }
    else console.log("Container creation:", result.created);
});

module.exports = function (app, passport) {

    // normal routes ===============================================================

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        res.render('index', {
            user        : req.user,
            pageTitle   : 'Main page'
        });
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    app.get('/profile', isLoggedIn, function (req, res) {
        res.redirect('/user/'+req.user._id);
    });

    app.get('/user/:user_id', function (req, res) {
        request(API_URL+'/api/users/'+req.param('user_id'), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.render('profile/profile.ejs', {
                    user        : req.user, // get the user out of session and pass to template
                    profile     : JSON.parse(body),
                    pageTitle   : 'Profile'
                });
            } else {
                res.redirect('/');
            }
        });
    });

    app.get('/user/:user_id/pets', function (req, res) {
        res.render('profile/pets.ejs', {
            user        : req.user, // get the user out of session and pass to template
            author      : req.param('user_id'),
            pageTitle   : 'Profile'
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('back');
    });

    // =====================================
    // PETS ================================
    // =====================================

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname)
        }
    });
    var upload = multer({ storage: storage });

    app.post('/pets', isLoggedIn, upload.single('image'), function (req, res){
        console.log("file", req.file);
        
        var extension = req.file.originalname.split('.').pop();
        var filename = makeFilename() + '.' + extension;

        var options = {
            contentType: req.file.mimetype,
            metadata: { fileName: filename }
        };

        blobService.createBlockBlobFromLocalFile(containerName, filename, req.file.path, options,
            function(error, result, response) {
                if (!error) {
                    setSAS(containerName, filename);

                    request({
                        uri     : API_URL+"/api/pets",
                        method  : "POST",
                        json    : {
                            form: req.body,
                            file: req.file,
                            user: req.user
                        }
                    }, function(error, response, body) {
                        res.redirect("/pets/"+body.pet._id);
                    });
                } else {
                    console.log("Error:", error);
                }
            });

    });

    app.get('/pets/create', isLoggedIn, function (req, res) {
        res.render('pets/create_pet', {
            user        : req.user, // get the user out of session and pass to template
            pageTitle   : 'Create pet'
        });
    });

    app.get('/pets/:pet_id', function (req, res) {
        isAuthorBool(req, function(err, isAuthor){
            if (err) res.redirect('/');

            res.render('pets/single_pet', {
                isAuthor    : isAuthor,
                user        : req.user, // get the user out of session and pass to template
                pageTitle   : 'Single pet'
            });
        });
    });

    app.get('/pets/:pet_id/edit', isLoggedIn, isAuthor, function (req, res) {
        res.render('pets/edit_pet', {
            isAuthor    : true,
            user        : req.user, // get the user out of session and pass to template
            pageTitle   : 'Single pet'
        });
    });

    // =====================================
    // IMAGES ==============================
    // =====================================

    app.get('/img/:img_id', function (req, res) {
        Img.findById(req.param("img_id"), function (err, doc) {
            if (err) res.send(err);
            else if (doc) {
                res.contentType(doc.img.contentType);
                res.send(doc.img.data);
            }
            else res.send("Oops! Image not found.");
        });
    });

    //todo: create page for pet editing

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    //// =====================================
    //// LOGIN ===============================
    //// =====================================
    //// show the login form
    //app.get('/login', function (req, res) {
    //
    //    // render the page and pass in any flash data if it exists
    //    res.render('auth/login.ejs', {
    //        message     : req.flash('loginMessage'),
    //        pageTitle   : 'Login'
    //    });
    //});
    //
    //// process the login form
    //app.post('/login', passport.authenticate('local-login', {
    //    successRedirect : '/profile',
    //    failureRedirect : '/login', // redirect back to the signup page if there is an error
    //    failureFlash    : true // allow flash messages
    //}));

    //// =====================================
    //// SIGNUP ==============================
    //// =====================================
    //// show the signup form
    //app.get('/signup', function (req, res) {
    //
    //    // render the page and pass in any flash data if it exists
    //    res.render('auth/signup.ejs', {
    //        message     : req.flash('signupMessage'),
    //        pageTitle   : 'Sign up'
    //    });
    //});
    //
    //// process the signup form
    //app.post('/signup', passport.authenticate('local-signup', {
    //    successRedirect : '/profile', // redirect to the secure profile section
    //    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    //    failureFlash    : true // allow flash messages
    //}));
    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : 'back',
            failureRedirect : '/'
        }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : 'back',
            failureRedirect : '/'
        }));

    // =====================================
    // VK ROUTES ===========================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/vk', passport.authenticate('vkontakte', {scope: 'email'}));

    // the callback after google has authenticated the user
    app.get('/auth/vk/callback',
        passport.authenticate('vkontakte', {
            successRedirect : 'back',
            failureRedirect : '/'
        }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    //// locally --------------------------------
    //app.get('/connect/local', function(req, res) {
    //    res.render('auth/connect-local.ejs', {
    //        message     : req.flash('signupMessage'),
    //        pageTitle   : "Add Local Account"
    //    });
    //});
    //app.post('/connect/local', passport.authenticate('local-signup', {
    //    successRedirect : 'back', // redirect to the secure profile section
    //    failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
    //    failureFlash    : true // allow flash messages
    //}));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : 'back',
            failureRedirect : '/'
        }));

    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect : 'back',
            failureRedirect : '/'
        }));

    // VK -------------------------------------

    // send to vk to do the authentication
    app.get('/connect/vk', passport.authorize('vkontakte'));

    // the callback after vk has authorized the user
    app.get('/connect/vk/callback',
        passport.authorize('vkontakte', {
            successRedirect : 'back',
            failureRedirect : '/'
        }));

    //TODO: implement unlinking
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// route middleware to make sure a user is an author of the pet's profile
function isAuthor(req, res, next) {

    request(API_URL+'/api/pets/'+req.param('pet_id'), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body).system.author.toString() === req.user._id.toString());
            if (JSON.parse(body).system.author.toString() === req.user._id.toString()) return next();
        } else {
            console.log('Cannot get pet ', error);
            res.redirect('/');
        }
    });
}

function isAuthorBool(req, callback){
    request(API_URL+'/api/pets/'+req.param('pet_id'), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if(req.user)    callback(error, (JSON.parse(body).system.author.toString() === req.user._id.toString()));
            else            callback(error, false);
        } else {
            console.log('Cannot get pet ', error);
            callback(error, null);
        }
    });
}

function makeFilename(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function setSAS(containerName, blobName) {
    var sharedAccessPolicy = {
        AccessPolicy: {
            Expiry: azure.date.minutesFromNow(3)
        }
    };

    var blobUrl = blobService.getUrl(containerName, blobName, sharedAccessPolicy);
    console.log("access the blob at ", blobUrl);
}