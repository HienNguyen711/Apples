'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var session = require('express-session');
var MongoStore= require('connect-mongo')(session);
var User = require('./models/user');
//mockApi.json
var api = require('./api/mockApi.json');
//iterate array from object
var apiArray = Object.keys(api).map(function(value){
  return api[value]
});

function generateOrFindUser(accessToken, refreshToken, profile, done){
  if(profile.emails[0]) {
    User.findOneAndUpdate(
      { email: profile.emails[0] },
      {
        name: profile.displayName || profile.username,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
      },
      {
        upsert: true
      },
    done
  );
  } else {
    var noEmailError = new Error("Your email privacy settings prevent you from signing into Bookworm.");
    done(noEmailError, null);
  }
}
//github strategy
passport.use(new GitHubStrategy({
    clientID: '2fd7756d2a349ce05bc3',
    clientSecret: '2843e4d16da19c2fe1519957f388d3a8f923bb53',
    callbackURL: 'http://localhost:3000/auth/github/return'
  },
  generateOrFindUser)
);


//serialize
passport.serializeUser(function(user, done){
	done(null, user._id);
});

//deserialize
passport.deserializeUser(function(userId, done){
	User.findById(userId, done);
});

var index = require('./routes/index');
var products = require('./routes/products');

var login = require('./routes/login');

var register = require('./routes/register');
//auth route
var auth = require('./routes/auth');
var profile = require('./routes/profile');
var api = require('./routes/api');




var app = express();

app.use('/static',express.static(__dirname+'/public'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));//serve static files

//mongodb connection
mongoose.connect("mongodb://localhost:27017/apples");
var db = mongoose.connection;
//session config for passport and mongodb
var sessionOptions = {
  secret: "this is a super secret dadada",
	resave: true,
	saveUninitialized: true,
  	store: new MongoStore({
  	  mongooseConnection: db
 	})
};

app.use(session(sessionOptions));
//init passport.js
app.use(passport.initialize());
//restore session
app.use(passport.session());


// mongo error
db.on('error', console.error.bind(console, 'connection error:'));




app.use('/', index);
app.use('/products', products);
app.use('/login', login);
app.use('/register', register);
app.use('/auth', auth);

app.use('/profile', profile);
app.use('/api', api);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;



