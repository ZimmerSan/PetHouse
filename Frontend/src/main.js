$(function(){
   var Post = require('./post');
   var api = require('./api');

   if(window.location.pathname === '/'){
      Post.initializeMainPostList();
   }
});