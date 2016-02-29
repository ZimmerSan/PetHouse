$(function(){
   var Pet = require('./pet');
   var api = require('./api');

   if(window.location.pathname === '/'){
      Pet.initializeMainPetList();
   }
});