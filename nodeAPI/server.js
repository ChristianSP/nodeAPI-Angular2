// server.js

//var frontUrl = "http://angularwords.esy.es";
var frontUrl = "http://localhost:4200";

var User   = require('./app/models/users');
var Liga   = require('./app/models/ligas');
var Jornada = require('./app/models/jornadas');


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
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", frontUrl);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");
  //res.header("Access-Control-Allow-Methods", "*");
  //res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
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
var mailOptions = {
    from: '"NO_REPLY Node Angular App"',
    to: "",
    subject: '',
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

// SOCKETIO
io.on('connection', (socket) => {

  console.log('user connected');

  socket.on('disconnect', function(){
    console.log(socket.username + " is offline");
    User.findOne({name: socket.username},function(err,user){
        if(err){
          console.log(err);
        }
        if(user){
          socket.leaveAll();
          user.status = "DISCONNECTED";
          user.save(function(err,user){
            if(err){
              console.log(err)
            }
            socket.broadcast.to(user.name).emit('friendDisconnected',true);
          });
        }
      });
  });
  
  socket.on('online', (username) => {
    console.log(username + " is online");
    socket.username = username;
    User.findOne({name: username},function(err,user){
      if(err){
        console.log(err);
      }
      if(user){
        for(let friend of user.friends){
          socket.join(friend.user);
        }
        socket.join(user.name);
        user.status = "CONNECTED";
        user.save(function(err,user){
          if(err){
            console.log(err)
          }
          socket.broadcast.to(user.name).emit('friendConnected',true);
        });
      }
    });
  });

  socket.on('updateJoinFriends', (username) => {
    User.findOne({name: username},function(err,user){
      if(err){
        console.log(err);
      }
      if(user){
        socket.leaveAll();
        for(let friend of user.friends){
          socket.join(friend.user);
        }
        socket.join(user.name);
      }
    });
  });

  socket.on('requestSended', (data) => {
    console.log(data.reciever + " recieve a friend request by " +data.sender);
    //Avisar al que la recibe que actualice su lista
    socket.broadcast.to(data.reciever).emit('requestRecieved',data);
  });

  socket.on('requestAccepted', (data) => {
    console.log(data.accepter + " accept a friend request of "+data.accepted);
    //Avisar al aceptado que actualice su lista
    socket.broadcast.to(data.accepted).emit('requestAccepted',data);
  });

});


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
                mailOptions.to = user.email;
                mailOptions.subject = "NO_REPLY Email confirmation";
                mailOptions.html = mailsGenerator.confirmationMailTemplate(user);
                transporter.sendMail(mailOptions, function (error, info) {
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

router.post('/recoverPassword', function(req, res) {
  // find the user
  User.findOne({email: req.body.email}, function(err, user) {
		if (err) throw err;
    if (user) {
        var date = new Date();
        date.setHours(date.setHours() + 1);

        user.resetPasswordToken = shortId.generate();
        user.resetPasswordExpiration = date;
        
        user.save(function(err,user){
          if(err){
            console.log(err); 
            res.json({ success: false });
          }else{
            // send mail with defined transport object 
            mailOptions.to = user.email;
            mailOptions.subject = "NO_REPLY Password reset";
            mailOptions.html = mailsGenerator.recoverPasswordMail(user);
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                return console.log(error);
              }
              console.log('Message %s sent: %s', info.messageId, info.response);
            });
          }
        });
		}
    res.json({ success: true });
	});
});

router.post('/resetPassword', function(req, res) {
  User.findOne({"resetPasswordToken": req.body.token}, function(err, user) {
		if (err) throw err;
		if (!user) {
				res.json({ success: false, error: "invalid" });
		} else if (user) {
				// check if password matches
        
        var expirationDate = new Date(user.resetPasswordExpiration)
        var now = new Date();

				if (now > expirationDate) {
						res.json({ success: false, error: 'expired' });
				}else {
						user.resetPasswordToken=null;
            user.resetPasswordExpiration = new Date();
            user.password = bcrypt.hashSync(req.body.password);
						user.save(function(err,user){
							if(err){
                console.log(err) 
                res.json({ success: false });
              }else{
                console.log('User resetpassword successfully');
                res.json({ success: true });
              }
						});
				}   
		}
	});
});

// more routes for our API will happen here

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.get('/users',middleware.isAuthenticated,function(req,res){
    User.find({},function(err,users){
      if(!err) res.json({success: true,users: users});
      else res.json({success: false, error: "dberror"});
    })
})

apiRoutes.post('/users/create',middleware.isAuthenticated,function(req,res){
    User.findOne({"name": req.body.user.name}, function(err,user){
      if(user){
        res.json({ success: false, error: "name" });
      }else{
        User.findOne({"email": req.body.user.email}, function(err,user){
          if(user){
            res.json({ success: false, error: "email" });
          }else{
            var newUser = new User(req.body.user);
            newUser.password = bcrypt.hashSync(shortId.generate());
            newUser.save(function (err,user){
              if(err){
                console.log(err) 
                res.json({ success: false });
              }else{
                console.log('User created by admin successfully');
                res.json({ success: true });
              }
            });
          }
        });
      }
    });
})

apiRoutes.post('/users/delete',middleware.isAuthenticated,function(req,res){
    User.remove({"name": req.body.user.name}, function(err,user){
        if(err){
          console.log(err);
          res.json({success:false});
        }else{
          console.log("user deleted")
          res.json({success:true});
        }
    });
})

apiRoutes.post('/users/edit',middleware.isAuthenticated,function(req,res){
    User.findOne({"name": req.body.oldUser.name}, function(err,user){
        if(err){
          console.log(err);
          res.json({success:false});
        }else{
          var attrsChanged = Object.keys(req.body.newUser);
          for( var i = 0 ; i < attrsChanged.length ; i++){
            user[attrsChanged[i]] = req.body.newUser[attrsChanged[i]];
          }
          user.save(function(err,user){
            if(err){
              console.log(err);
              res.json({success:false});
            }else{
              console.log("user edited")
              res.json({success:true});
            }
          })
          
        }
    });
})

apiRoutes.post('/users/resetPassword', function(req, res) {
  User.findOne({"name": req.body.user.name}, function(err, user) {
		if (err) throw err;
		if (!user) {
				res.json({ success: false });
		} else if (user) {
				var date = new Date();
        date.setHours(date.setHours() + 1);

        user.resetPasswordToken = shortId.generate();
        user.resetPasswordExpiration = date;
        
        user.save(function(err,user){
          if(err){
            console.log(err); 
            res.json({ success: false });
          }else{
            // send mail with defined transport object 
            mailOptions.to = user.email;
            mailOptions.subject = "NO_REPLY Password reset";
            mailOptions.html = mailsGenerator.recoverPasswordMail(user);
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                return console.log(error);
              }
              console.log('Message %s sent: %s', info.messageId, info.response);
            });
          }
        });
		}
    res.json({ success: true });
	});
});

apiRoutes.post('/users/addFriend', function(req, res) {
  User.findOne({"name": req.body.newFriend.name}, function(err, newFriend) {
		if (err) throw err;
		if (!newFriend) {
				res.json({ success: false });
		} else if (newFriend) {
      newFriend.friends.push({user: req.body.user.name,status:"PENDING"});
      newFriend.save(function(err,newFriend){
        if(err){
          console.log(err);
        }else{
          User.findOne({"name": req.body.user.name}, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false });
            } else if (user) {
              user.friends.push({user: req.body.newFriend.name,status:"SENDED"});
              user.save(function(err,user){
                if(err){
                  console.log(err);
                }else{
                  console.log("friend request saved")
                  res.json({ success: true });
                }
              });
            }
          });
        }
      });
      
    }
	});
});

apiRoutes.post('/users/acceptFriend', function(req, res) {
  User.findOne({"name": req.body.user.name}, function(err, user) {
		if (err) throw err;
		if (!user) {
				res.json({ success: false });
		} else if (user) {
      var changed = false;
      for(var i=0;i<user.friends.length && !changed;i++){
        if(user.friends[i].user === req.body.friend.user){
            user.friends[i].status = "ACCEPTED";
            changed = true;
        }
      }
      user.save(function(err){
        if(err){
          console.log(err);
        }else{
          User.findOne({"name": req.body.friend.user}, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false });
            } else if (user) {
              var changed = false;
              for(var i=0;i<user.friends.length && !changed;i++){
                if(user.friends[i].user === req.body.user.name){
                    user.friends[i].status = "ACCEPTED";
                    changed = true;
                }
              }
              user.save(function(err){
                if(err){
                  console.log(err);
                }else{
                  
                  console.log("accepted friend request")
                  res.json({ success: true });
                }
              }); 
            }
          });
        }
      }); 
    }
	});
});

apiRoutes.post('/users/cancelFriend', function(req, res) {
  User.findOne({"name": req.body.user.name}, function(err, user) {
		if (err) throw err;
		if (!user) {
				res.json({ success: false });
		} else if (user) {
      user.friends = user.friends.filter(function(el){
        return el.user != req.body.friend.user;
      })
      user.save(function(err){
        if(err){
          console.log(err);
        }else{
           User.findOne({"name": req.body.friend.user}, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false });
            } else if (user) {
              user.friends = user.friends.filter(function(el){
                return el.user != req.body.user.name;
              })
              user.save(function(err){
                if(err){
                  console.log(err);
                }else{
                  console.log("canceled friend request")
                  res.json({ success: true });
                }
              }); 
            }
          });
        }
      }); 
    }
	});
});

apiRoutes.get('/ligas',middleware.isAuthenticated,function(req,res){
    Liga.find({},function(err,ligas){
      if(!err) res.json({success: true,ligas: ligas});
      else res.json({success: false, error: "dberror"});
    })
});

apiRoutes.post('/ligas/create',middleware.isAuthenticated,function(req,res){
    Liga.findOne({"name": req.body.liga.name}, function(err,liga){
      if(liga){
        res.json({ success: false, error: "name" });
      }else{
        Liga.findOne({"idApi": req.body.liga.idApi}, function(err,liga){
          if(liga){
            res.json({ success: false, error: "idApi" });
          }else{
            var newLiga = new Liga(req.body.liga);
            newLiga.save(function (err,liga){
              if(err){
                console.log(err) 
                res.json({ success: false });
              }else{
                console.log('Liga created by admin successfully');
                res.json({ success: true });
              }
            });
          }
        });
      }
    });
});

apiRoutes.post('/ligas/delete',middleware.isAuthenticated,function(req,res){
    Liga.remove({"name": req.body.liga.name}, function(err,liga){
        if(err){
          console.log(err);
          res.json({success:false});
        }else{
          console.log("liga deleted")
          res.json({success:true});
        }
    });
});

apiRoutes.post('/ligas/edit',middleware.isAuthenticated,function(req,res){
    Liga.findOne({"name": req.body.oldLiga.name}, function(err,liga){
        if(err){
          console.log(err);
          res.json({success:false});
        }else{
          var attrsChanged = Object.keys(req.body.newLiga);
          for( var i = 0 ; i < attrsChanged.length ; i++){
            liga[attrsChanged[i]] = req.body.newLiga[attrsChanged[i]];
          }
          liga.save(function(err,liga){
            if(err){
              console.log(err);
              res.json({success:false});
            }else{
              console.log("liga edited")
              res.json({success:true});
            }
          })
          
        }
    });
});

apiRoutes.get('/jornadas',middleware.isAuthenticated,function(req,res){
    Jornada.find({},function(err,jornadas){
      if(!err) res.json({success: true,jornadas: jornadas});
      else res.json({success: false, error: "dberror"});
    })
});

apiRoutes.post('/jornadas/create',middleware.isAuthenticated,function(req,res){
    Jornada.findOne({$or:[
    {liga: req.body.jornada.liga, inicio: req.body.jornada.inicio},
    {liga: req.body.jornada.liga, fin: req.body.jornada.fin},
    {liga: req.body.jornada.liga, matchday: req.body.jornada.matchday}]}, function(err,jornada){
      if(jornada){
        res.json({ success: false });
      }else{
            var newJornada = new Jornada(req.body.jornada);
            newJornada.save(function (err,jornada){
              if(err){
                console.log(err) 
                res.json({ success: false });
              }else{
                console.log('Jornada created by admin successfully');
                res.json({ success: true });
              }
            });
          }
    });
});

apiRoutes.post('/jornadas/delete',middleware.isAuthenticated,function(req,res){
    Jornada.remove({"liga": req.body.jornada.liga,"matchday": req.body.jornada.matchday}, function(err,liga){
        if(err){
          console.log(err);
          res.json({success:false});
        }else{
          console.log("jornada deleted")
          res.json({success:true});
        }
    });
});

apiRoutes.post('/jornadas/edit',middleware.isAuthenticated,function(req,res){
    //TODO
});

apiRoutes.post('/jornadas/currentByLiga',middleware.isAuthenticated,function(req,res){
    Jornada.find({liga: req.body.liga.name}, function(err,jornadas){
      if(!jornadas || err){
        res.json({ success: false });
      }else{
            var hoy = new Date();
            var encontrado = false;
            var i = 0;
            while(!encontrado && i<jornadas.length){
              var inicio = new Date(jornadas[i].inicio);
              var fin = new Date(jornadas[i].fin);
              if(hoy > inicio && hoy < fin){
                encontrado = true;
              }else{
                i++;
              }
            }
            if(encontrado){
              res.json({success: true, jornada: jornadas[i]});
            }else{
              res.json({success: false});
            }
      }
    });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);



// START THE SERVER
// =============================================================================
http.listen(port);
console.log('Magic happens on port ' + port);





