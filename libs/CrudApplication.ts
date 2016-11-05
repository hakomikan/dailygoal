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
    var self = this;

    router.get("/", (req,res) => {
      self.model.find({}, function(err, docs: any[]) {
        docs.forEach(element => {
          console.log(element.subject);
        });
        res.render('crud/list',
          {
            title: self.definition.name,
            items: docs,
            createurl: self.definition.url + "/create",
            properties: self.definition.properties,
          });
      });
    });

    router.post("/create", (req, res) => {
      console.log("Add:", req.body);

      self.model.create(req.body, (err, doc)=>{
        if(err) {
          console.log("create error: " + err);
        }

        res.redirect(self.definition.url + "/");
      });
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