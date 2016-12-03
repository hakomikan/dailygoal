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
import {Application, Request, Response} from "express";
import {PrepareOpenIdConnect} from "./libs/OpenIdConnect";
import {DoneRecordApplication} from "./apps/DoneRecord";

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
var EnsureAuthenticated = authenticator.EnsureAuthenticated;

var dailyGoalApplication = new CrudApplication(DailyGoalApplication, authenticator);
dailyGoalApplication.Join(app);

var doneRecordApplication = new CrudApplication(DoneRecordApplication, authenticator);
doneRecordApplication.Join(app);

app.get('/', EnsureAuthenticated, function (req, res) {
  res.redirect('/DailyGoal');
});

app.get('/:date([0-9]{4}-[0-9]{2}-[0-9]{2})', (req: Request, res: Response) => {
  dailyGoalApplication.model.find((err, doc) => {
    if(err) {
      console.log(err);
    }
    else {
      res.render("date", {date: req.params.date, items: doc});
    }
  });
});

app.listen(app.get('port'), function() {
  Database.Initialize();
  console.log('Node app is running on port', app.get('port'));
});
