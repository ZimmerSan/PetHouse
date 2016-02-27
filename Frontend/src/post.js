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