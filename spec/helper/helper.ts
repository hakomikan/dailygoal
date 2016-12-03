/// <reference path="../../typings/index.d.ts" />
import * as express from "express";

export function finish_test (done: any) {
  return function (err) {
    if (err) {
      done.fail(err)
    } else {
      done()
    }
  }
}

export function WrapAsync(promise: () => Promise<void>) : (DoneFn) => void {
  return done => {
    promise()
    .then(() => {
      done();
    })
    .catch(err=>{
      done.fail(err);
    });
  };
}

export function make_app(router: express.Router, appdecorator = (app) => {}) {
  var app = express();
  appdecorator(app);
  app.use("/", router);
  return app;
}
