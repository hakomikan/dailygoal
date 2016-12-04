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
app.use('/dist',  express.static(__dirname + '/dist'));
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

function WrapRoute(processor: (req: Request, res: Response) => Promise<void>) : (Request, Response) => void
{
  return (req, res) => {
    processor(req, res)
    .catch(err => {
      console.log(`ERROR: ${err}`);
    });
  }
}

app.get('/:date([0-9]{4}-[0-9]{2}-[0-9]{2})', WrapRoute(async (req, res) => {
  let goals = await dailyGoalApplication.model.find().populate("records")
  res.render("date", {
    date: req.params.date,
    items: goals,
    url_check: goal => `${req.url}/${goal._id}/check`,
    url_uncheck: goal => `${req.url}/${goal._id}/uncheck`
  });
}));

app.get('/:date([0-9]{4}-[0-9]{2}-[0-9]{2})/:goal_id/check', WrapRoute(async (req, res) => {
  let hasGoal = 0 < await doneRecordApplication.model.count({goal: req.params.goal_id, date: new Date(req.params.date)});
  if(!hasGoal) {
    await new doneRecordApplication.model({goal: req.params.goal_id, date: new Date(req.params.date)}).save();
  }
  res.redirect(`/${req.params.date}`);
}));

app.get('/:date([0-9]{4}-[0-9]{2}-[0-9]{2})/:goal_id/uncheck', WrapRoute(async (req, res) => {
  await doneRecordApplication.model.remove({goal: req.params.goal_id, date: new Date(req.params.date)});
  res.redirect(`/${req.params.date}`);  
}));

app.listen(app.get('port'), function() {
  Database.Initialize();
  console.log('Node app is running on port', app.get('port'));
});
