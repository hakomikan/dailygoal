// <reference path="../typings/index.d.ts" />
import * as express from "express";
import * as mongodb from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import * as pug  from 'pug';
import * as mongoose from "mongoose";
import {Authenticator, PseudoAuthenticator} from "./Authenticator";

export class CrudApplication
{
  definition : any;
  model: mongoose.Model<mongoose.Document>;
  authenticator: Authenticator;

  constructor(applicationDefinition: any, authenticator: Authenticator = new PseudoAuthenticator() ) {
    this.definition = applicationDefinition;
    mongoose.model(this.definition.name, this.definition.schema);
    this.model = mongoose.model(this.definition.name);
    this.authenticator = authenticator;
  }

  GetUserId(req: any) : String {
    return this.authenticator.GetUserId(req);
  }

  MakeRouter() : express.Router {
    var router = express.Router();
    var self = this;

    router.get("/", this.authenticator.EnsureAuthenticated, (req,res) => {
      self.model.find({owner_id: this.GetUserId(req)}, function(err, docs: any[]) {
        res.render('crud/list',
          {
            title: self.definition.name,
            items: docs,
            createurl: self.definition.url + "/create",
            deleteurl: (id) => self.definition.url + "/" + id + "/delete",
            editurl: (id) => self.definition.url + "/" + id + "/edit",
            properties: self.definition.properties,
          });
      });
    });

    router.post("/create", this.authenticator.EnsureAuthenticated, (req, res) => {
      var session: any = req.session;
      req.body.owner_id = this.GetUserId(req);
      console.log("Add:", req.body);
      self.model.create(req.body, (err, doc)=>{
        if(err) {
          console.log("create error: " + err);
        }

        res.redirect(self.definition.url + "/");
      });
    });

    router.get("/:id/edit", this.authenticator.EnsureAuthenticated, (req, res) => {
      self.model.findOne({_id: req.params.id, owner_id: this.GetUserId(req)}, (err, doc: any) => {
        res.render('crud/edit',
          {
            title: self.definition.name,
            item: doc,
            createurl: self.definition.url + "/create",
            deleteurl: (id) => self.definition.url + "/" + id + "/delete",
            updateurl: (id) => self.definition.url + "/" + id + "/update",
            listurl: self.definition.url + "/",
            properties: self.definition.properties,
          });
      });
    });

    router.post("/:id/update", this.authenticator.EnsureAuthenticated, (req, res) => {
      self.model.findOneAndUpdate({ _id: req.params.id, owner_id: this.GetUserId(req)}, req.body, (err, doc) => {
        if(err) {
          console.log("remove error: " + err);
        }
        
        res.redirect(self.definition.url + "/");
      });
    });

    router.get("/:id/delete", this.authenticator.EnsureAuthenticated, (req, res) => {
      self.model.remove({ _id: req.params.id, owner_id: this.GetUserId(req)}, (err) => {
        if(err) {
          console.log("remove error: " + err);
        }
        
        res.redirect(self.definition.url + "/");
      });
    });

    return router;
  }

  Join(app : express.Application)
  {
    app.use(this.definition.url, this.MakeRouter());
  }
}