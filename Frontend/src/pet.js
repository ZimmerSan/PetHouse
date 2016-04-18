var api = require('./api');
var Templates = require('./templates');

function initializePetForm() {
}

function showPetList(list, element) {
    element.html("");

    function showOnePet(pet) {
        var html_code = Templates.Pet_Short({pet: pet});
        var $node = $(html_code);

        //$node.find(".buy-big").click(function(){});

        element.append($node);
    }

    list.forEach(showOnePet);
}

function initializeUserPetList(user_id) {
    api.getPetsByAuthor(user_id, function (err, result) {
        if (err) {
            alert("Can't get user Pets");
        } else {
            console.log('result: ', result);
            showPetList(result, $("#profile_pets"));
        }
    });
}


function initializeMainPetList() {
    api.getAllPets(function (err, result) {
        if (err) {
            alert("Can't get all Pets");
        } else {
            showPetList(result, $("#pet_list"));
        }
    });
}

function showOnePetFull(pet, element) {
    element.html("");

    function showOnePet(pet) {
        var html_code = Templates.Pet_Full({pet: pet});
        var $node = $(html_code);

        $node.find(".image").attr('src', pet.pet.img);
        //$node.find(".buy-big").click(function(){});

        element.append($node);
    }

    showOnePet(pet);
}

function onePetFull(pet_id) {
    api.getPetById(pet_id, function (err, result) {
        if (err) {
            alert("Can't get the pet");
        } else {
            showOnePetFull(result, $("#pet_full"));
        }
    });
}

function petSearch(pet_info) {
    api.getPetsSortBySexASpecies(pet_info, function (err, result) {
        if (err) {
            alert("Can't search the pet");
        } else {
            showPetList(result, $(".last_added"));
        }
    });
}

exports.initializePetForm = initializePetForm;
exports.initializeMainPetList = initializeMainPetList;
exports.initializeUserPetList = initializeUserPetList;
exports.onePetFull = onePetFull;
exports.petSearch=petSearch;