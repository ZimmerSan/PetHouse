var api         = require('./api');
var Templates   = require('./templates');

function initializePetForm() {
}

function showPetList(list, element){
    element.html("");

    function showOnePet(pet) {
        var html_code = Templates.Pet_Short({pet: pet});
        var $node = $(html_code);

        $node.find(".image").attr('src', pet.pet.img);
        //$node.find(".buy-big").click(function(){});

        element.append($node);
    }

    list.forEach(showOnePet);
}

function initializeUserPetList(user_id) {
    api.getPetsByAuthor(user_id, function(err, result){
        if(err) {
            alert("Can't get user Pets");
        } else {
            console.log('result: ',result);
            showPetList(result, $("#profile_pets"));
        }
    });
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

        $node.find(".image").attr('src', pet.pet.img);
        //$node.find(".buy-big").click(function(){});

        element.append($node);
    }

    showOnePet(pet);
}

function onePetFull(pet_id) {
    api.getPetById(pet_id,function(err, result){
        if(err) {
            alert("Can't get the pet");
        } else {
            showOnePetFull(result, $("#pet_full"));
        }
    });
}

function fillPetEditForm(pet, element) {
    element.html("");
    var html_code = Templates.Pet_Edit({pet: pet});
    var $node = $(html_code);

    var $form = $node.find("#pet_edit_form");
    var keys = Object.keys(pet.pet);
    console.log(keys);
    keys.forEach(function(item){
        var temp = pet.pet[item];
        switch (item){
            case 'img': $form.append('<img src="'+temp+'"><input id="'+item+'" name="'+item+'" type="file" placeholder="'+item+'" value="'+temp+'" class="form-control input-md">');
                        break;
            default:    $form.append('<input id="'+item+'" name="'+item+'" type="text" placeholder="'+item+'" value="'+temp+'" class="form-control input-md">');
                        break;
        }
    });
    $form.append('<!-- Select Basic --><div class="form-group"><label class="col-md-4 control-label" for="selectbasic">Status</label><div class="col-md-4"><select id="selectbasic" name="selectbasic" class="form-control"><option value="free">free</option><option value="taken">taken</option></select></div></div>');
    //$node.find(".buy-big").click(function(){});

    element.append($node);

}

function onePetEdit(pet_id){
    api.getPetById(pet_id, function(err, result){
        if(err){
            alert("Can't get pet info");
        } else {
            console.log('result: ',result);
            fillPetEditForm(result, $("#pet_edit")); //todo
        }
    });
}

exports.initializePetForm = initializePetForm;
exports.initializeMainPetList = initializeMainPetList;
exports.initializeUserPetList = initializeUserPetList;
exports.onePetFull = onePetFull;
exports.onePetEdit = onePetEdit;