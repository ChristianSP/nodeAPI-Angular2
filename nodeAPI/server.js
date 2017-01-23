// server.js

var User   = require('./app/models/users');

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//DB SETUP
var assert = require('assert');
var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/wordsDB';
mongoose.connect(url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to DB")
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3033;        // set our port



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.post('/signup',function(req,res){
    User.findOne({"name": req.body.name}, function(err,user){
      console.log("name--> "+user);
      if(user){
        res.json({ success: false, error: "name" });
      }
    });
    User.findOne({"email": req.body.email}, function(err,user){
      console.log("email--> "+user);
      if(user){
        res.json({ success: false, error: "email" });
      }
    });
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password)
    });
    console.log(newUser)
    newUser.save(function (err){
      if(err){
        console.log(err) 
        res.json({ success: false });
      }else{
        console.log('User saved successfully');
        res.json({ success: true });
      }
    });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

