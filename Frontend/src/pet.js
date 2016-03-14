var api         = require('./api');
var Templates   = require('./templates');

function initializePetForm() {
}

function showPetList(list, element){
    element.html("");

    function showOnePet(pet) {
        var html_code = Templates.Pet_Short({pet: pet});
        var $node = $(html_code);

        $node.find(".image").attr('src', "/img/"+pet.pet.img);

        //$node.find(".buy-big").click(function(){});

        element.append($node);
    }

    list.forEach(showOnePet);
}

function initializeMainPetList() {
    api.getAllPets(function(err, result){
        if(err) {
            alert("Can't get all Pets");
        } else {
            showPetList(result, $("#pet_list"));
        }
    });
}

exports.initializePetForm = initializePetForm;
exports.initializeMainPetList = initializeMainPetList;