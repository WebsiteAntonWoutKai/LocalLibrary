//in dit file worden de credentials van de admin gecontroleerd
const User = require("../models/user");

module.exports = (req, res, next) => {
  //check als de admin credentials gelden voor huidige user gebonden aan session
  if (req.session.userid) {
    User.findById(req.session.userid).exec((err, found_user) => {
      if(err) {
          return next(err);
      }
      if (found_user == null) {
          // No results.
          const err = new Error("No session in progres.");
          err.status = 404;
          return next(err);
      }
      if (!found_user.isAdmin) {
        const err = new Error("You are not the admin.");
        err.status = 101;
        return next(err);
      }
      next();
    })
  }
  else {
    res.redirect("/user/login");
  };
}