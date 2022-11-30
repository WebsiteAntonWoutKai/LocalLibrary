const { body, validationResult } = require("express-validator");
const async = require("async");
const User = require("../models/user");

exports.index = (req, res) => {
    if(req.session.userid) {
        User.findById(req.session.userid).exec((err, found_user) => {
            if (err) {
                return next(err);
            }
            if (found_user == null) {
                res.render("layout");
            }
            else {
                res.render("layout", {
                    user: found_user,
                    })
            }
        })
    }
    else {
        res.render("layout");
    }
};
