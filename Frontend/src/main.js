$(function () {
    var Pet = require('./pet');
    var api = require('./api');

    //show list of all pets on main page
    if (window.location.pathname === '/') {
        Pet.initializeMainPetList();
    }

    //show list of user's pets on '/user/:user_id/pets'
    if (window.location.pathname.match(/\/user\/\w+\/pets/g)) {
        var id = window.location.pathname.substring(window.location.pathname.indexOf('/user/')+'/user/'.length, window.location.pathname.indexOf('/pets'));
        console.log('id', id);
        if(id !== 'create')
        Pet.initializeUserPetList(id);
    }

});