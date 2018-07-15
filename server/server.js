require('./configs/config.js');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
// var mongoose = require('mongoose');
var path = require('path');
var session = require('express-session');
var cors = require('cors');
var passport = require('passport'); 
const port=process.env.PORT;
// Init App
var app = express();
app.use(cors());

//Logger
app.use(morgan('dev'));

//session
app.use(session({
  secret: "sEcrEt",
  resave: true,
  saveUninitialized: true
}));

//Passport
app.use(passport.initialize());  
app.use(passport.session());  
require('./middlewares/passport')(passport);

// BodyParser Middleware
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

//Set view to angular folder
//app.use(express.static(path.join(__dirname, './../public')));

console.log( __dirname + '/server/views');
// include views
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

//Setting routes main file
app.use('/', require('./controllers/index.js'));

// Set Port
app.set('port', (process.env.PORT || 3000));

// catch 404 and forward to error handler
// app.get('*', function (req, res, next) {
//   req.status = 404;
//   next("Page Not Found!!");
// });

// error handler
app.use(function (err, req, res, next) {
  res.send(err);
});

app.get("/", function(req, res) {
  res.render('index.ejs');
  // var myResponse=responseGenerator.generate(false,"Welcome to Ekart",200,null);
  // res.send(myResponse);
});
//listening port
app.listen(port, function () {
    console.log(`Started up at port ${port}`);
});