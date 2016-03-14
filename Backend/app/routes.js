var flash   = require('connect-flash');
var api     = require('./api');
var request = require('request');
var multer  = require('multer');


var Img     = require('./models/img');

var API_URL = "http://localhost:5050"

module.exports = function (app, passport) {

    // normal routes ===============================================================

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        res.render('index', {pageTitle: 'Main page'});
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    //todo: maybe change to /profile/:user_id
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile/profile.ejs', {
            user        : req.user, // get the user out of session and pass to template
            pageTitle   : 'Profile'
        });
    });



    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
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
        request({
            uri: API_URL+"/api/pets",
            method: "POST",
            json: {
                form: req.body,
                file: req.file,
                user: req.user
            }
        }, function(error, response, body) {
            res.redirect("/pets/"+body.pet._id);
        });
    });

    app.get('/pets/create', isLoggedIn, function (req, res) {
        res.render('pets/create_pet', {
            user        : req.user, // get the user out of session and pass to template
            pageTitle   : 'Create pet'
        });
    });

    app.get('/pets/:pet_id', function (req, res) {
        res.render('pets/single_pet', {
            user        : req.user, // get the user out of session and pass to template
            pageTitle   : 'Single pet'
        });
    });

    // =====================================
    // IMAGES ==============================
    // =====================================

    app.get('/img/:img_id', function (req, res, next) {
        Img.findById(req.param("img_id"), function (err, doc) {
            if (err) return next(err);
            res.contentType(doc.img.contentType);
            res.send(doc.img.data);
        });
    });

    //todo: create page for pet editing
    //todo: create page for user's pets review

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('auth/login.ejs', {
            message     : req.flash('loginMessage'),
            pageTitle   : 'Login'
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash    : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('auth/signup.ejs', {
            message     : req.flash('signupMessage'),
            pageTitle   : 'Sign up'
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash    : true // allow flash messages
    }));

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
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
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // =====================================
    // VK ROUTES ===========================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/vk', passport.authenticate('vkontakte'));

    // the callback after google has authenticated the user
    app.get('/auth/vk/callback',
        passport.authenticate('vkontakte', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('auth/connect-local.ejs', {
            message     : req.flash('signupMessage'),
            pageTitle   : "Add Local Account"
        });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash    : true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // VK -------------------------------------

    // send to vk to do the authentication
    app.get('/connect/vk', passport.authorize('vkontakte'));

    // the callback after vk has authorized the user
    app.get('/connect/vk/callback',
        passport.authorize('vkontakte', {
            successRedirect : '/profile',
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