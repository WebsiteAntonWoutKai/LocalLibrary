const User = require("../models/user");
const async = require("async");
const { body, validationResult } = require("express-validator");

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const crypto = require('crypto');
const { Console } = require("console");
const user = require("../models/user");
const item = require("../models/item");
const authTokens = {};

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}
  
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}


/*
// to support URL-encoded bodies
router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieParser());

router.use((req, res, next) => {
  const authToken = req.cookies['AuthToken'];
  req.user = authTokens[authToken];
  next();
});
 */

exports.user_login_get = function (req, res, next) {
    //nagaan als er al een session bezig is, indien ja redirect meteen naar user
    if (req.session.userid) {
        User.findById(req.session.userid).exec((err, found_user) => {
            if(err) {
                return next(err);
            }
            if (found_user == null) {
                // No results.

                req.session.destroy(err => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect("/users/login");
                })
                /*const err = new Error("No session in progress.");
                err.status = 404;
                return next(err);*/
            }
            else {
                if (found_user.isAdmin) {
                    res.redirect(found_user.adminUrl);
                }
                else {
                   res.redirect(found_user.url); 
                }
            }
        })
    }
    //indien neen, genereer login page
    else {
        res.render("login", { title: "Login" });
    }
};

exports.user_login_post = function (req, res) {

    const hashedPassword = getHashedPassword(req.body.password);

    User.findOne({ email: req.body.email })
        .exec((err, found_user) => {
            if (err) {
                return next(err);
            }
            if (found_user == null) {
                // No results.
                res.render('login', {
                    error: "No account linked to this email.",
                    messageClass: 'alert-danger'
                });
            }
            else {
                // Successful, so render.
                if (found_user.password === hashedPassword) {
                    req.session.userid = found_user.id;
                    req.session.isLoggedIn = true;
                    req.session.save();
                    if (found_user.isAdmin) {
                        res.redirect(found_user.adminUrl);
                    }
                    else {
                        res.redirect(found_user.url);
                    }
                }
                else {
                    res.render('login', {
                        error: "Wrong Password.",
                        messageClass: 'alert-danger'
                    });
                }
            }
        });  
};

exports.user_register_get = function (req, res, next) {
    res.render("register_form", { title: "Register" });
};

exports.user_register_post = [
    // Validate and sanitize fields.
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified.")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters."),
    body("date_of_birth", "Invalid date of birth")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body("email")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Email must be specified.")
        .isEmail()
        .withMessage("Must be a valid email address."),
    body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password is at least 8 charachters long.")
        .escape()
        .withMessage("Password must be specified.")
        .isStrongPassword()
        .withMessage("Password not strong enough."),
    body("confirmPassword")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password is at least 8 charachters long.")
        .escape()
        .withMessage("Password must be specified."),
    body("street")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Address name must be specified.")
        .isAlphanumeric()
        .withMessage("Street name has non-alphanumeric characters."),
    body("city")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("City name must be specified.")
        .isAlphanumeric()
        .withMessage("City name has non-alphanumeric characters."),
    body("country")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Country name must be specified."),
    body("number")
        .trim()
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Number must be numeric"),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("register_form", {
                title: "Register Account",
                user: req.body,
                errors: errors.array(),
            });
            return;
        }

    if (req.body.password === req.body.confirmPassword) {
        User.findOne({ email: req.body.email }).exec((err, found_user) => {
            if (err) {
                return next(err);
            }

            if (found_user) {
                // Email already taken
                res.render("register_form", {
                    title: "Register Account",
                    user: req.body,
                    message: "Email already taken",
                    errors: "Email already taken",
                });
                return;
            } else {
                // Data from form is valid.
                const hashedPassword = getHashedPassword(req.body.password);

                // Create an User object with escaped and trimmed data.
                const user = new User({
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    email: req.body.email,
                    password: hashedPassword,
                    street: req.body.street,
                    city: req.body.city,
                    number: req.body.number,
                    country: req.body.country,
                });

                user.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    // Successful - redirect to login page.
                    res.render('login', {
                    message: 'Registration Complete. Please login to continue.',
                    messageClass: 'alert-success'
                    });
                });
            };
        });
    }
    else {
        res.render('register_form', {
            message: 'Password does not match.',
            messageClass: 'alert-danger'
        });
    }
}];

exports.user_protected_get = function (req, res, next) {  
    if (req.session.user === user) {
        if (user.isAdmin) {
            res.redirect(user.adminUrl);
        }
        else {
            res.redirect(user.url);
        }
    } else {
        res.redirect('/users/login')
    }
};

exports.user_logout_get = function(req, res, next) {
    //destroy de session als de user uitlogt + verwijder winkelmand
    User.findById(req.session.userid).exec((err, found_user) => {
        if (err) {
            return next(err);
        }
        found_user.clearCart();
    })
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        res.redirect("/users/login");
    })
};

// Display list of all Users.
exports.user_list = function (req, res, next) {
    User.find()
        .sort([["family_name", "ascending"]])
        .exec(function (err, list_users) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render("user_list", {
                title: "User List",
                user_list: list_users,
            });
        });
};

// Display detail page for a specific User.
exports.user_detail = (req, res, next) => {
    async.parallel(
        {
            user(callback) {
                User.findById(req.params.id).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                // Error in API usage.
                return next(err);
            }
            if (results.user == null) {
                // No results.
                const err = new Error("User not found");
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render("user_detail", {
                title: "User Detail",
                user: results.user,
                cart: results.user.shoppingCart.items,
            });
        }
    );
};

// Display User delete form on GET.
exports.user_delete_get = (req, res, next) => {
    async.parallel(
        {
            user(callback) {
                User.findById(req.params.id).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.user == null) {
                // No results.
                res.redirect("/catalog");
            }
            // Successful, so render.
            res.render("user_delete", {
                title: "Delete User",
                user: results.user,
            });
        }
    );
};

// Handle User delete on POST.
exports.user_delete_post = (req, res, next) => {
    async.parallel(
        {
            user(callback) {
                User.findById(req.body.userid).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            req.user_logout_get;
            // Success
            User.findByIdAndRemove(req.body.userid, (err) => {
                if (err) {
                    return next(err);
                }
                // Success - go to User list
                res.redirect("/catalog/");
            });
        }
    );
};

// Display User update form on GET.
exports.user_update_get = function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return next(err);
        }
        if (user == null) {
            // No results.
            var err = new Error("User not found");
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render("user_form", { title: "Update User", user: user });
    });
};

// Handle User update on POST.
exports.user_update_post = [
    // Validate and santize fields.
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Family name must be specified.")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters."),
    body("date_of_birth", "Invalid date of birth")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body("email")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Email must be specified.")
        .isEmail()
        .withMessage("Must be a valid email address."),
    body("street")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Address name must be specified.")
        .isAlphanumeric()
        .withMessage("Street name has non-alphanumeric characters."),
    body("city")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("City name must be specified.")
        .isAlphanumeric()
        .withMessage("City name has non-alphanumeric characters."),
    body("number")
        .trim()
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Number must be numeric"),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create User object with escaped and trimmed data (and the old id!)
        var user = new User({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            email: req.body.email,
            street: req.body.street,
            city: req.body.city,
            number: req.body.number,
            country: req.body.country,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render("user_form", {
                title: "Update User",
                user: user,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            User.findByIdAndUpdate(
                req.params.id,
                user,
                {},
                function (err, theuser) {
                    if (err) {
                        return next(err);
                    }
                    // Successful - redirect to genre detail page.
                    res.redirect(theuser.url);
                }
            );
        }
    },
];

/*
//misschien beter om dit in itemcontroller te zetten, dan is item al beschikbaar en kan user uit session gehaald worden
exports.user_addToCart_get = function (req, res, next) {
    if (req.session.userid) {
        res.render("item_detail_addToCart");
    }
    else{
        res.render("login", { title: "Login" });
    }
};

exports.user_addToCart_post = [
    body("size")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("City name must be specified.")
        .isAlphanumeric()
        .withMessage("City name has non-alphanumeric characters."),
    body("number")
        .trim()
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Number must be numeric"),

    (req, res, next) => {
        async.parallel({
            user(callback) {
                User.findById(req.session.userid).exec(callback);
            },
            item(callback) {
                Item.findById(req.body.item.id).exec(callback);
            },
        })
        user.findById(req.session.userid).exec((err, found_user) => {
            if(err) {
                return next(err);
            }
            if (found_user == null) {
                // No results.
                const err = new Error("No session in progress.");
                err.status = 404;
                return next(err);
            }
            found_user.addToCart
            
        });
    }
];
*/