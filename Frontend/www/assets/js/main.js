(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
$(function(){
   var Post = require('./post');
   var api = require('./api');

   Post.initializePostForm();
});
},{"./api":1,"./post":3}],3:[function(require,module,exports){
var api = require('./api');

$('.create-post-form').submit(function( event ) {
    api.createPost({
        name            : $('.create-post-form #name').val(),
        //TODO: image
        species         : $('.create-post-form #species').val(),
        //TODO: all other fields
        //breed           : $('.create-post-form #breed').val(),
        sex             : $('.create-post-form input[name="sex"]').val(),
        //location        : $('.create-post-form #location').val(),
        //att_to_children : $('.create-post-form #att_to_children').val(),
        //character       : $('.create-post-form #character').val(),
        //vaccinations    : $('.create-post-form #vaccinations').val(),
        other           : $('.create-post-form #other').val()
    }, function(err, result){
        if(err) {
            alert("Can't create post");
        } else {
            console.log(result);
            //window.location.href = "/posts/"+result.post._id;
        }
    });
    event.preventDefault();
});

function initializePostForm() {
}

exports.initializePostForm = initializePostForm;
},{"./api":1}]},{},[2]);
