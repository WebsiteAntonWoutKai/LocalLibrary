//in dit file komen de operaties die enkel de admin kan uitvoeren, zoals producten toevoegen enzo

const Item = require("../models/item");
const User = require("../models/user");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const async = require("async");
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

function saveImage(item, imageEncoded) {
    if (imageEncoded == null) return
    const image = JSON.parse(imageEncoded)
    if (image != null && imageMimeTypes.includes(image.type)) {
        item.image = new Buffer.from(image.data, 'base64')
        item.imageType = image.type
    }
}

exports.admin_details = function (req, res, next) {
    User.findById(req.session.userid).exec((err, found_user) => {
        if(err) {
            return next(err);
        }
        if (found_user == null) {
            // No results.
            const err = new Error("Admin not found.");
            err.status = 404;
            return next(err);
        }
        if (found_user.isAdmin) {
            // Successful, so render.
            res.render("admin_detail", {
                title: "Admin Page",
                user: found_user,
            });
        }
    })
};

//toevoegen van een nieuw product aan de webshop
exports.addProduct_get = function (req, res, next) {
    //res.send("ADDING OF PRODUCT NOT IMPLIMENTED YET");
    async.parallel(
        {
            categories(callback) {
                Category.find(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            res.render("item_form", {
                title: "Create Item",
                categories: results.categories,
                user: User.findById(req.session.userid),
            });
        }
    );
};

exports.addProduct_post = [
    (req, res, next) => {
        console.log("test1");
        if (!Array.isArray(req.body.category)) {
            req.body.category =
                typeof req.body.category === "undefined" ? [] : [req.body.category];
        }
        next();
    },
    // Validate and sanitize fields.
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("category.*").escape(),
    body("price")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("summary")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("stockLarge")
        .trim()
        .escape()
        .isNumeric()
        .withMessage("Must be numeric."),
    body("stockMedium")
        .trim()
        .escape()
        .isNumeric()
        .withMessage("Must be numeric."),
    body("stockSmall")
        .trim()
        .escape()
        .isNumeric()
        .withMessage("Must be numeric."),
    // Process request after validation and sanitization.
    (req, res, next) => {
        console.log("test2");
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            summary: req.body.summary,
            stockLarge: req.body.stockLarge,
            stockMedium: req.body.stockMedium,
            stockSmall: req.body.stockSmall,
        });

        saveImage(item, req.body.image);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            // Get all authors and genres for form.
            console.log("test3"),
            async.parallel(
                (err, results) => {
                    console.log("test4");
                    if (err) {
                        return next(err);
                    }
                    // Mark our selected genres as checked.
                    for (const category of results.categories) {
                        if (item.category.includes(category._id)) {
                            category.checked = "true";
                        }
                    }
                    res.render("item_form", {
                        title: "Create Item",
                        categories: results.categories,
                        item,
                        user: User.findById(req.session.userid),
                        errors: errors.array(),
                    });
                }
            );
            return;
        }
        item.save((err) => {
            if (err) {
                return next(err);
            }
            console.log("test5");
            res.redirect(item.url);
        });
    },
];

exports.addCategory_get = function (req, res, next) {
    res.render("category_form", { title: "Create Category" });
};

exports.addCategory_post = [
    // Validate and sanitize fields.
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        const category = new Category({
            name: req.body.name,
        });
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render("category_form", {
                title: "Create Category",
                category,
                user: User.findById(req.session.userid),
                errors: errors.array(),
            });
            return;
        }
        // Data from form is valid.
        Category.findOne({ name: req.body.name }).exec((err, found_category) => {
            if (err) {
                return next(err);
            }

            if (!(found_category === null)) {
                res.redirect(found_category.url);
            } else {
                category.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    res.redirect(category.url);
                });
            }
        });
    },
];
/*
//verwijderen van product uit webshop
exports.removeProduct_get = (req, res, next) => {
    
};


exports.removeProduct_post = (req, res, next) => {
    //doel: adhv het form het gewenste product opzoeken en functie die ze verwijdert oproepen
};

//updaten van product (vb stock, prijs, image, ...)
exports.updateProduct_get = (req, res, next) => {
   
};

exports.updateProduct_post = [
    //doel: adhv het form de gewenste products opzoeken en functie die ze zal updaten oproepen
];
*/

