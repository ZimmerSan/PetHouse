var API_URL = "http://localhost:5050";

function backendGet(url, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'GET',
        success: function(data){
            callback(null, data);
        },
        fail: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendPost(url, data, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            callback(null, data);
        },
        fail: function(){
            callback(new Error("Ajax Failed"));
        }
    })
}

exports.getAllPets = function(callback) {
    backendGet("/api/pets", callback);
};

exports.getPetById = function(id, callback) {
    backendGet("/api/pets/"+id, callback);
};

exports.createPet = function(pet_info, callback) {
    backendPost("/api/pets/", pet_info, callback);
};

exports.getPetsByAuthor = function(author_id, callback) {
    backendGet("/api/pets/author"+author_id, callback);
};

exports.uploadImg = function(filepath, callback) {
    backendPost("/api/img/", {filepath : filepath}, callback);
};
