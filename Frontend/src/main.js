$(function () {
    var Pet = require('./pet');
    var api = require('./api');

    //show list of all pets on main page
    if (window.location.pathname === '/') {
        Pet.initializeMainPetList();
    }

    //show single pet on '/pets/:pet_id'
    if (window.location.pathname.indexOf('/pets/')>=0) {
        var id = window.location.pathname.substring(window.location.pathname.indexOf('/pets/')+'/pets/'.length);
        if(id !== 'create')
        Pet.onePetFull(id);
    }

    //show list of user's pets on '/user/:user_id/pets'
    if (window.location.pathname.match(/\/user\/\w+\/pets/g)) {
        var id = window.location.pathname.substring(window.location.pathname.indexOf('/user/')+'/user/'.length, window.location.pathname.indexOf('/pets'));
        console.log('id', id);
        if(id !== 'create')
        Pet.initializeUserPetList(id);
    }

});