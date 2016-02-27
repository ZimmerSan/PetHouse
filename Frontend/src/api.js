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

exports.getAllPosts = function(callback) {
    backendGet("/api/posts", callback);
};

exports.getPostById = function(id, callback) {
    backendGet("/api/posts/"+id, callback);
};

exports.createPost = function(post_info, callback) {
    backendPost("/api/posts/", post_info, callback);
};
