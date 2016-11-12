/// <reference path="../typings/index.d.ts" />
import * as request from "supertest";
import * as express from "express";
import * as helpers from "./helper/helper";
import * as mongodb from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import * as pug  from 'pug';
import {CrudApplication} from '../libs/CrudApplication';
import {DailyGoalApplication} from '../apps/DailyGoal';
import * as Database from "../libs/Database";

var app : express.Application = null;
Database.Initialize('mongodb://localhost/dailygoal-test');

describe("DailyGoalApplication", () => {
  beforeAll( (done) => {
    app = express();
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'pug');
    done();
  });

  it("should access to app root", (done) => {
    var dailyGoalApplication = new CrudApplication(DailyGoalApplication);
    dailyGoalApplication.Join(app);

    request(app)
      .get("/dailygoal/")
      .expect('Content-Type', /html/)
      .expect(/DailyGoal/)
      .expect(200)
      .end(helpers.finish_test(done));
  });
});
