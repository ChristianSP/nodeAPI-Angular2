var express    = require('express');        // call express
var app        = express();
var jwt    = require('jsonwebtoken');
var config = require('./config');

app.set('superSecret',config.secret);

exports.isAuthenticated = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        console.log('noauth-request');
        return res.json({ success: false, error: 'noauth' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;

        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    console.log('notoken-request');
    return res.status(403).send({ 
        success: false, 
        error: 'notoken' 
    });
    
  }
}