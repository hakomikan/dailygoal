var passport = require('passport');
var session = require('express-session');
import {Application} from "express";

export function PrepareOpenIdConnect(app: Application)
{
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
      res.redirect('/');
    }
  );

  app.get('/login', function (req, res){
    if(req.isAuthenticated()) {
      res.redirect('/')
    }
    else {
      res.render('login');
    }
  });  
}
