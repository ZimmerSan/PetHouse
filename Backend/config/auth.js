// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '234445103561896',
        'clientSecret'  : 'be156011a71252a831f97d72cf383ab5',
        'callbackURL'   : 'http://localhost:5050/auth/facebook/callback'
    },

    'googleAuth' : {
        'clientID'      : '843147385208-f0qgvn0lgtidc7d6of53q1j2c3t6798s.apps.googleusercontent.com',
        'clientSecret'  : 'eNTaN9mkRJWfYdJIKEUmryXV',
        'callbackURL'   : 'http://localhost:5050/auth/google/callback'
    },

    'vkAuth' : {
        'clientID'      : '5321612',
        'clientSecret'  : 'R86taYtQoSxhLeQqrkuP',
        'callbackURL'   : 'http://localhost:5050/auth/vk/callback'
    }

};