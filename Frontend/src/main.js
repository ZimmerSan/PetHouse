$(function () {
    var Pet = require('./pet');
    var api = require('./api');

    if (window.location.pathname === '/') {
        Pet.initializeMainPetList();
    }
    if (window.location.pathname.indexOf('/pets/')>=0) {
        var id = window.location.pathname.substring(window.location.pathname.indexOf('/pets/')+'/pets/'.length);
        if(id !== 'create')
        Pet.onePetFull();
    }
});