var express     = require('express');
var app         = express();
var path        = require('path');
var mongoose    = require('mongoose');
var passport    = require('passport');
var flash       = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var api     = require('./app/api');

var configDB = require('./config/database.js');

function configureEndpoints(app) {
    var router = express.Router();

    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        console.log('Something is happening.');
        next(); // make sure we go to the next routes and don't stop here
    });

    // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    // more routes for our API will happen here

    router.route('/users')

        // create a user (accessed at POST http://localhost:5050/api/users)
        .post(api.createUser)

        // get all the users (accessed at GET http://localhost:5050/api/users)
        .get(api.getAllUsers);

    router.route('/users/:user_id')

        // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
        .get(api.getUserById)

        // update the user with this id (accessed at PUT http://localhost:8080/api/users/:user_id)
        .put(api.updateUserById)

        // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
        .delete(api.deleteUserById);

    router.route('/pets')
        .post(api.createPet)
        .get(api.getAllPets);

    router.route('/pets/author/:author_id')
        .get(api.getPetsByAuthor);

    router.route('/pets/:pet_id')
        .get(api.getPetById)

    router.route('/img')
        .post(api.uploadImg);

    router.route('/img/:img_id')
        .get(api.getImgById);

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);

    //Якщо не підійшов жоден url, тоді повертаємо файли з папки www
    app.use(express.static(path.join(__dirname, '../Frontend/www')));
}

function startServer(port) {

    // configuration -------------------------------------
    mongoose.connect(configDB.url); // connect to our database
    require('./config/passport')(passport); // pass passport for configuration

    // set up our express application
    app.use(morgan('dev')); // log every request to the console
    app.use(cookieParser());// read cookies (needed for auth)
    app.use(flash());

    //Розбір POST запитів
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //Налаштування директорії з шаблонами
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // required for passport
    app.use(session({ secret: 'hellodearpetlovers' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

    // routes --------------------------------------------
    require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

    //Налаштовуємо сторінки
    configureEndpoints(app);

    //Запуск додатка за вказаним портом
    app.listen(port, function () {
        console.log('My Application Running on http://localhost:'+port+'/');
    });
}
exports.startServer = startServer;