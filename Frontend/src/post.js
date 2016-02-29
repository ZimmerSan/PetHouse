var api         = require('./api');
var Templates   = require('./templates');

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

function showPostList(list, element){
    element.html("");

    function showOnePost(post) {
        var html_code = Templates.Post_Short({post: post});
        var $node = $(html_code);
        //$node.find(".buy-big").click(function(){});

        element.append($node);
    }

    list.forEach(showOnePost);
}

function initializeMainPostList() {
    api.getAllPosts(function(err, result){
        if(err) {
            alert("Can't get all posts");
        } else {
            showPostList(result, $("#post_list"));
        }
    });
}

exports.initializePostForm = initializePostForm;
exports.initializeMainPostList = initializeMainPostList;