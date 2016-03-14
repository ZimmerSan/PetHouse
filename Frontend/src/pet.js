var api         = require('./api');
var Templates   = require('./templates');


$('#create-pet-button').click(function( event ){
    alert("I've been clicked");
    $('.create-pet-form').submit();
    event.preventDefault();
});

//$('.create-pet-form').submit(function( event ) {
//
//    api.createPet({
//        name            : $('.create-pet-form #name').val(),
//        //TODO: image
//        species         : $('.create-pet-form #species').val(),
//        //TODO: all other fields
//        //breed           : $('.create-pet-form #breed').val(),
//        sex             : $('.create-pet-form input[name="sex"]').val(),
//        //location        : $('.create-pet-form #location').val(),
//        //att_to_children : $('.create-pet-form #att_to_children').val(),
//        //character       : $('.create-pet-form #character').val(),
//        //vaccinations    : $('.create-pet-form #vaccinations').val(),
//        other           : $('.create-pet-form #other').val()
//    }, function(err, result){
//        if(err) {
//            alert("Can't create pet");
//        } else {
//            api.uploadImg($('.create-pet-form #image').val(), function(err, result){
//                if(err) {
//                    alert("Can't create pet");
//                } else {
//                    alert("Uploaded!");
//                }
//            });
//            //window.location.href = "/pets/"+result.pet._id;
//        }
//    });
//    event.preventDefault();
//});

function initializePetForm() {
}

function showPetList(list, element){
    element.html("");

    function showOnePet(pet) {
        var html_code = Templates.Pet_Short({pet: pet});
        var $node = $(html_code);
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

function showOnePetFull(pet, element){
    element.html("");

    function showOnePet(pet) {
        var html_code = Templates.Pet_Full({pet: pet});
        var $node = $(html_code);
        //$node.find(".buy-big").click(function(){});

        element.append($node);
    }

    showOnePet(pet);
}

function onePetFull(id) {
    api.getPetById(id,function(err, result){
        if(err) {
            alert("Can't get all Pets");
        } else {
            showOnePetFull(result, $("#pet_full"));
        }
    });
}

exports.initializePetForm = initializePetForm;
exports.initializeMainPetList = initializeMainPetList;
exports.onePetFull = onePetFull;