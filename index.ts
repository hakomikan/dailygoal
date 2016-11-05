/// <reference path="typings/index.d.ts" />

var express = require('express');
var pug = require('pug');
var path = require("path"); 
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
import {CrudApplication} from './libs/CrudApplication';
import {DailyGoalApplication, DailyGoal} from './apps/DailyGoal';
import * as Database from "./libs/Database";

var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

var OpenidConnectStrategy = require('passport-openidconnect').Strategy;
app.use(session({ resave:false, saveUninitialized:false, secret: 'sadfasdfas' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new OpenidConnectStrategy({
    authorizationURL: "https://accounts.google.com/o/oauth2/auth",
    tokenURL: "https://accounts.google.com/o/oauth2/token",
    userInfoURL: "https://www.googleapis.com/oauth2/v1/userinfo",
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/oauth2callback",
    scope: ["openid", "email", "profile" ]
}, function(accessToken, refreshToken, profile, done) {
    console.log('accessToken: ', accessToken);
    console.log('refreshToken: ', refreshToken);
    console.log('profile: ', profile);
    return done(null, profile);
}));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(obj, done){
    done(null, obj);
});

app.get('/auth/google', passport.authenticate('openidconnect'));

app.get('/oauth2callback',
  passport.authenticate(
    'openidconnect',
    {
      failureRedirect: '/login',
    }
  ),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

var ensureAuthenticated = function(req, res, next){
    console.log(req.isAuthenticated());
    if(req.isAuthenticated())
        return next();
    res.redirect("/login");
};

app.get('/login', function (req, res){
  if(req.isAuthenticated()) {
    res.redirect('/')
  }
  else {
    res.render('login');
  }
});

app.get('/', ensureAuthenticated, function (req, res) {
  DailyGoal.find({}, function(err, docs: any[]) {
    for (var i=0, size=docs.length; i<size; ++i) {
      console.log(docs[i].subject);
    }
    console.log("user: "+req.user.displayName);
    res.render('index', {items: docs, user: req.user.name});
  });
});

var dailyGoalApplication = new CrudApplication(DailyGoalApplication, DailyGoal);
dailyGoalApplication.Join(app);

app.listen(app.get('port'), function() {
  Database.Initialize();
  console.log('Node app is running on port', app.get('port'));
});
