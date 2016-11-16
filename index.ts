/// <reference path="typings/index.d.ts" />

var express = require('express');
var pug = require('pug');
var path = require("path"); 
var mongoose = require('mongoose');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
import {CrudApplication} from './libs/CrudApplication';
import {DailyGoalApplication} from './apps/DailyGoal';
import * as Database from "./libs/Database";
import {Authenticator, OpenIdConnectAuthenticator} from "./libs/Authenticator";
import {Application} from "express";
import {PrepareOpenIdConnect} from "./libs/OpenIdConnect";

var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

PrepareOpenIdConnect(app);

var authenticator = new OpenIdConnectAuthenticator();
var dailyGoalApplication = new CrudApplication(DailyGoalApplication, authenticator);
dailyGoalApplication.Join(app);

app.get('/', authenticator.EnsureAuthenticated, function (req, res) {
  res.redirect('/DailyGoal');
});

app.listen(app.get('port'), function() {
  Database.Initialize();
  console.log('Node app is running on port', app.get('port'));
});
