export interface Authenticator
{
  EnsureAuthenticated(req, res, next) : any;
  GetUserId(req) : String;
}

export class OpenIdConnectAuthenticator implements Authenticator
{
  EnsureAuthenticated(req, res, next) : any {
    if(req.isAuthenticated())
        return next();
    res.redirect("/login");
  }

  GetUserId(req) : String {
    return req.session.passport.user._json.id;
  }
}

export class PseudoAuthenticator implements Authenticator
{
  EnsureAuthenticated(req, res, next) : any {
    return next();
  }

  GetUserId(req) : String {
    return null;
  }
}
