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
var middleware = require('./middleware');
var shortId = require('shortid');
var nodemailer = require('@nodemailer/pro');
var mailsGenerator = require('./mails');
var config = require('./config');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");
  next();
});


//Mail SETUP
var nodemailer = require('@nodemailer/pro');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.userMail,
        pass: config.passMail
    }
});

// setup email data with unicode symbols
var mailConfirmationOptions = {
    from: '"NO_REPLY Node Angular App"',
    to: "",
    subject: 'NO_REPLY Email confirmation',
    html: ""
};

//DB SETUP
var assert = require('assert');
var mongoose = require('mongoose');
mongoose.connect(config.database);
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

app.set('superSecret',config.secret);


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.post('/confirmEmail', function(req, res) {
  // find the user
  User.findOne({"verificationToken": req.body.token}, function(err, user) {
		if (err) throw err;
		if (!user) {
				res.json({ success: false });
		} else if (user) {
				// check if password matches
				if (user.isVerified) {
						res.json({ success: false, error: 'alreadyVerified' });
				}else {
						user.isVerified=true;
						user.save(function(err,user){
							if(err){
                console.log(err) 
                res.json({ success: false });
              }else{
                console.log('User verified successfully');
                res.json({ success: true });
              }
						});
				}   
		}
	});
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
				}else {
						if(!user.isVerified){
								res.json({ success: false, error: 'noverified' });
						}else{
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
		}
	});
});

router.post('/signup',function(req,res){
    User.findOne({"name": req.body.name}, function(err,user){
      if(user){
        res.json({ success: false, error: "name" });
      }else{
        User.findOne({"email": req.body.email}, function(err,user){
          if(user){
            res.json({ success: false, error: "email" });
          }else{
            var newUser = new User({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password),
              verificationToken: shortId.generate() 
            });
            newUser.save(function (err,user){
              if(err){
                console.log(err) 
                res.json({ success: false });
              }else{
                console.log('User saved successfully');
                // send mail with defined transport object
                mailConfirmationOptions.to = user.email;
                mailConfirmationOptions.html = mailsGenerator.confirmationMailTemplate(user);
                transporter.sendMail(mailConfirmationOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });
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

apiRoutes.post('/users',middleware.isAuthenticated,function(req,res){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    User.find({},function(err,users){
      if(!err) res.json({success: true,users: users});
      else res.json({success: false, error: "dberror"});
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





