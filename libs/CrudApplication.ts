// <reference path="../typings/index.d.ts" />
import * as express from "express";
import * as mongodb from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import * as pug  from 'pug';
import * as mongoose from "mongoose";

export class CrudApplication
{
  definition : any;
  model: mongoose.Model<mongoose.Document>;

  constructor(applicationDefinition: any, mongooseModel: mongoose.Model<mongoose.Document>) {
    this.definition = applicationDefinition;
    this.model = mongooseModel;
  }

  MakeRouter() : express.Router {
    var router = express.Router();

    router.get("/", (req,res) => {
      res.render('crud/list',
        {
          title: this.definition.name,
          items: [],
          createurl: this.definition.url + "/create",
          properties: this.definition.properties,
        });
    });

    router.post("/create", (req, res) => {
    });

    router.get("/:id", (req, res) => {
      
    });

    router.post("/:id/delete", (req, res) => {

    });

    router.post("/:id/update", (req, res) => {
    })

    return router;
  }

  Join(app : express.Application)
  {
    app.use(this.definition.url, this.MakeRouter());
  }
}