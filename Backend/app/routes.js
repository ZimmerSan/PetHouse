var flash   = require('connect-flash');
var api     = require('./api');
var request = require('request');
var multer  = require('multer');
var fs      = require("fs");
var azure   = require('azure-storage');
var Img     = require('./models/img');
var API_URL = "http://localhost:5050";
var dbox    = require("dbox");
var dbox_config = require("../config/dropbox");
var app     = dbox.app({ "app_key": dbox_config.key, "app_secret": dbox_config.secret });
var client  = app.client(dbox_config.accessToken)

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
        var extension   = req.file.originalname.split('.').pop();
        var filename    = makeFilename() + '.' + extension;
        var buffer      = fs.readFileSync(req.file.path);

        client.put(filename, buffer, function(status, reply){
            client.media(reply.path, function(status, reply){
                request({
                    uri     : API_URL + "/api/pets",
                    method  : "POST",
                    json    : {
                        form: req.body,
                        file: reply.url,
                        user: req.user
                    }
                }, function (error, response, body) {
                    res.redirect("/pets/" + body.pet._id+"/");
                });
            });
        });
    });

    app.get('/pets/create', isLoggedIn, function (req, res) {
        res.render('pets/create_pet', {
            user        : req.user, // get the user out of session and pass to template
            pageTitle   : 'Create pet'
        });
    });

    app.get('/pets/:pet_id', function (req, res) {
        request({
            uri     : API_URL+"/api/pets/"+req.param('pet_id'),
            method  : "GET",
        }, function(error, response, body) {
            isAuthorBool(req, function(err, isAuthor){
                if (err) res.redirect('/');
                var pet = JSON.parse(body);

                request({
                    uri     : API_URL+"/api/users/"+pet.system.author,
                    method  : "GET",
                }, function (err, response, body) {
                    res.render('pets/single_pet', {
                        isAuthor    : isAuthor,
                        user        : req.user, // get the user out of session and pass to template
                        pageTitle   : 'Single pet',
                        pet         : pet,
                        author      : JSON.parse(body)
                    })
                });
            });
        });
    });

    app.get('/pets/:pet_id/edit', isLoggedIn, isAuthor, function (req, res) {
        request({
            uri     : API_URL+"/api/pets/"+req.param('pet_id'),
            method  : "GET",
        }, function(error, response, body) {
            res.render('pets/edit_pet', {
                isAuthor    : true,
                user        : req.user, // get the user out of session and pass to template
                pageTitle   : 'Single pet',
                pet         : JSON.parse(body)
            });
        });
    });

    app.post('/pets/:pet_id/edit', isLoggedIn, isAuthor, upload.single('image'), function (req, res) {
        if(req.file){
            var extension   = req.file.originalname.split('.').pop();
            var filename    = makeFilename() + '.' + extension;
            var buffer      = fs.readFileSync(req.file.path);

            client.put(filename, buffer, function(status, reply){
                client.media(reply.path, function(status, reply){
                    request({
                        uri     : API_URL + "/api/pets/"+req.param('pet_id'),
                        method  : "POST",
                        json    : {
                            form: req.body,
                            file: reply.url,
                            user: req.user
                        }
                    }, function (error, response, body) {
                        res.redirect("/pets/" + body.pet._id+"/");
                    });
                });
            });
        } else {
            request({
                uri     : API_URL+"/api/pets/"+req.param('pet_id'),
                method  : "POST",
                json    : {
                    form: req.body,
                    file: req.body.imageOld,
                    user: req.user
                }
            }, function(error, response, body) {
                console.log('body:', body);
                res.redirect("/pets/"+body.pet._id+"/");
            });
        }
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
            Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
            Start: new Date()
        }
    };

    var blobUrl = blobService.getUrl(containerName, blobName, sharedAccessPolicy);
    console.log('url',blobUrl);
    return blobUrl;
}

