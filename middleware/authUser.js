//in dit file worden de credentials van de admin gecontroleerd
const User = require("../models/user");
const async = require("async");

module.exports = (req, res, next) => {
  //check als de user credentials gelden voor huidige user gebonden aan session
    if (req.session.userid) {
        console.log("there is a session in progress");
        async.parallel({
            sessionUser(callback){
                User.findById(req.session.userid).exec(callback);
            },
            requestUser(callback) {
                User.findById(req.params.id).exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                console.log("error");
                return next(err);
            }
            if (results.sessionUser == null) {
                // No results.
                console.log("No session in progres.");
                const err = new Error("No session in progres.");
                err.status = 404;
                return next(err);
            }
            if (results.requestUser == null) {
                // No results.
                console.log("No user found.");
                const err = new Error("No user found.");
                err.status = 404;
                return next(err);
            }
            if (results.sessionUser.name === results.requestUser.name) {
                console.log("succes");
                next();
            }
            else {
                console.log("users dont match");
                res.redirect("/users/login");
            }
        })
    }
    else {
        console.log("redirect to login");
        res.redirect("/users/login");
    };
};