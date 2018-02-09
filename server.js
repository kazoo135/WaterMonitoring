var express = require("express");
var app = express();
var path = require('path');

//set view engine
app.set('view engine', 'ejs');
app.set('views', './public/views');
app.set('port', process.env.PORT || 8080);

//use packages and functions
app.use(express.static('./public'));

//routes
app.use(require('./routes/index'));


//connect to cloudant 
var mydb;
var me = '678f717f-f9aa-4988-b0fd-c5f914c84cc6-bluemix';
var password = 'f2f0a81d7190bb8dc1d691bee2ece6ada0ff730b1c527355d49b892430fd36a6'
var Cloudant = require('cloudant');
var cloudant = Cloudant({account:me, password:password});
Cloudant({url:"https://678f717f-f9aa-4988-b0fd-c5f914c84cc6-bluemix.cloudant.com", username:me, password:password}, function(er, cloudant, reply) {
  if (er)
    throw er

  console.log('Connected with username: %s', reply.userCtx.name)
})

cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});


app.listen( app.get('port'), function(){
  console.log("Listening on port " + app.get('port'));
});


