// server.js

var User   = require('./app/models/users');

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var jwt    = require('jsonwebtoken');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");
  next();
});

//DB SETUP
var assert = require('assert');
var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.database);
var db = mongoose.connection;

app.set('superSecret',config.secret);

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

router.post('/login', function(req, res) {

  // find the user
  User.findOne({$or:[
    {name: req.body.name},
  {email: req.body.name}]
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, error: 'name' });
    } else if (user) {

      // check if password matches
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.json({ success: false, error: 'password' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresIn: '1h' // expires in 1 hours
        });
        // return the information including token as JSON
        res.json({
          success: true,
          token: token
        });
      }   

    }

  });
});

router.post('/signup',function(req,res){
    User.findOne({"name": req.body.name}, function(err,user){
      console.log("name--> "+user);
      if(user){
        res.json({ success: false, error: "name" });
      }else{
        User.findOne({"email": req.body.email}, function(err,user){
          console.log("email--> "+user);
          if(user){
            res.json({ success: false, error: "email" });
          }else{
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
          }
        });
      }
    });
});

// more routes for our API will happen here

// get an instance of the router for api routes
var apiRoutes = express.Router();
// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  console.log(req.headers);
  console.log(req.body.token);
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, error: 'failed' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        error: 'notoken' 
    });
    
  }
});

apiRoutes.post('/users',function(req,res){
    User.find({},function(err,users){
      if(!err) res.json(users);
    })
})

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);



// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

