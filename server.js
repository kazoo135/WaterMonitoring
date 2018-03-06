var express = require("express");
var app = express();

//set view engine
app.set('view engine', 'ejs');
app.set('views', './public/views');
app.set('port', 8080);
// app.set('port', process.env.PORT || 8080);

//use packages and functions
app.use(express.static('./public'));

//routes in use
app.use(require('./routes/index'));

app.listen(app.get('port'), function(){
  console.log("Listening on port " + app.get('port'));
});


