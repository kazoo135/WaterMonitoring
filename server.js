var express = require("express"),
var app = express();

var port = process.env.PORT || 8080;
var path = require('path');

//serve static files such as css, imgs, from public folder
app.use(express.static(__dirname + '/public'));

app.get("/sayHello", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

app.get('/', function(request, response){
  response.sendFile('index.html', { root:path.join(__dirname, './views') });
});

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

app.listen(port);
console.log("Listening on port ", port);

