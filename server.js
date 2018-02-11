var express = require("express");
var app = express();
var dotenv = require('dotenv').config();
var Cloudant = require('cloudant');


//set view engine
app.set('view engine', 'ejs');
app.set('views', './public/views');
app.set('port', process.env.PORT || 8080);

//use packages and functions
app.use(express.static('./public'));

//routes in use
app.use(require('./routes/index'));


//connect to cloudant 
var mydb;

var dbUrl = process.env.DB_URL;
var username = process.env.DB_USER;
var password = process.env.DB_PASSWORD;
var cloudant = Cloudant({account:username, password:password});

Cloudant({url:dbUrl, username:username, password:password}, function(er, cloudant, reply) {
  if (er)
    throw er

  console.log('Connected with username: %s', reply.userCtx.name)
})

//list all available dbs
var allDbs = [];
cloudant.db.list( function(err, body ) {
  body.forEach(function(db){
    allDbs.push(db);
    console.log(db);
  })
});

//select db from cloudant
var envdata2 = cloudant.db.use('envdata2');
envdata2.list(function(err, body ){
  if(!err){
    body.rows.forEach((doc) => {
      console.log(doc);
    })
  }
})


app.listen( app.get('port'), function(){
  console.log("Listening on port " + app.get('port'));
});


