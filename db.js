const CLOUDANT = require('cloudant');

var cloudant = CLOUDANT({
    account:process.env.DB_USER, 
    password: process.env.DB_PASSWORD });

 var connection = Cloudant({
     url: process.env.DB_URL, 
     username:process.env.DB_USER, 
     password:DB_PASSWORD}, 
     function(er, cloudant, reply) {
        if (er)
          throw er
      
        console.log('Connected with username: %s', reply.userCtx.name)
      })

      module.exports = connection; 