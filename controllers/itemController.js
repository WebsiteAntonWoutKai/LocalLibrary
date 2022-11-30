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
exports.item_list = async (req, res) => {
    let query = Item.find()
    if (req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if (req.query.price != null && req.query.price != '') {
        query = query.lte('price',req.query.price)
    }
    try {
        const items = await query.exec()
        if (req.query.name === undefined) {
            res.render('item_list', {
                items: items,
                name: 'Search for an item',
                price: '0'
            })
        }
        else {
            res.render('item_list', {
                items: items,
                name: req.query.name,
                price: req.query.price
            })
        }
    } catch {
        res.redirect("/")
    }
}

// Display detail page for a specific Item.
exports.item_detail = (req, res, next) => {
    async.parallel(
        {
            item(callback) {
                Item.findById(req.params.id)
                    .populate("name")
                    .populate("category")
                    .populate("price")
                    .populate("summary")
                    .populate("stockLarge")
                    .populate("stockMedium")
                    .populate("stockSmall")
                    .exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.item == null) {
                //no resulsts
                const err = new Error("Item not found");
                err.status = 404;
                return next(err);
            }
            //Sucessful, so render
            //enkel als admin bezig is is update knop zichtbaar, anders niet
            if (req.session.userid) {
                User.findById(req.session.userid).exec((err, found_user) => {
                    if(err) {
                        return next(err);
                    }
                    if (found_user.isAdmin) {
                        res.render("item_detail_admin", {
                            name: results.item.name,
                            item: results.item,
                        });
                    }
                    else {
                        res.render("item_detail", {
                            name: results.item.name,
                            item: results.item,
                        });
                    }
                })
            }
            else {
                res.render("item_detail", {
                    name: results.item.name,
                    item: results.item,
                });
            }
        }
      );
};


exports.item_create_get = (req, res, next) => {
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
            });
        }
    );
};



exports.item_create_post = [
    (req, res, next) => {
        if (!Array.isArray(req.body.category)) {
            req.body.category =
                typeof req.body.category === "undefined" ? [] : [req.body.category];
        }
        next();
    },

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

        saveImage(item, req.body.image)

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            
            async.parallel(

                (err, results) => {
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
            res.redirect(item.url);
        });
    },
];




exports.item_delete_get = (req, res, next) => {
    async.parallel(
        {
            item(callback) {
                Item.findById(req.params.id).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.item == null) {
                // No results.
                res.redirect("/catalog/items");
            }
            // Successful, so render.
            res.render("item_delete", {
                title: "Delete Item",
                item: results.item,
            });
        }
    );
};

exports.item_delete_post = (req, res, next) => {
    async.parallel(
        {
            item(callback) {
                Item.findById(req.body.itemid).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            // Success
            Item.findByIdAndRemove(req.body.itemid, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/catalog/items");
            });
        }
    );
};

exports.item_update_get = (req, res, next) => {
    async.parallel(
        {
            item(callback) {
                Item.findById(req.params.id)
                    .populate("category")
                    .exec(callback);
            },
            categories(callback) {
                Category.find(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.item == null) {
                // No results.
                const err = new Error("Item not found");
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            for (const category of results.categories) {
                   if (category._id.toString() === results.item._id.toString()) {
                      category.checked = "true";
                   }
                
            }
            res.render("item_form", {
                title: "Update Item",
                categories: results.categories,
                item: results.item,
            });
        }
    );
};

exports.item_update_post = [
    (req, res, next) => {
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
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
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

                    // Mark our selected genres as checked.
                    for (const category of results.categories) {
                        if (item.category.includes(category._id)) {
                            category.checked = "true";
                        }
                    }
                    res.render("item_form", {
                        title: "Update Item",
                        categories: results.categories,
                        item,
                        errors: errors.array(),
                    });
                }
            );
            return;
        }

        // Data from form is valid. Update the record.
        Item.findByIdAndUpdate(req.params.id, item, {}, (err, theitem) => {
            if (err) {
                return next(err);
            }
            res.redirect(theitem.url);
        });
    },
];


exports.addToCart_get = function (req, res, next) {
    if (req.session.userid) {
        Item.findById(req.params.id).exec((err, found_item) => {
            if (err) {
                return next(err);
            }
            res.render("item_detail_addToCart", {
                item: found_item,
            });
        })
    }
    else {
        res.render("login", { title: "Login Before Adding Item To Cart." });
    }
};

exports.addToCart_post = [
    body("size").escape(),
    body("amount")
        .trim()
        .isNumeric(),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("item_detail_addToCart", {
                item: req.body,
                errors: errors.array(),
            });
            return;
        }
        async.parallel(
            {
                user(callback) {
                    User.findById(req.session.userid).exec(callback);
                },
                item(callback) {
                    Item.findById(req.params.id).exec(callback);
                },
            },
            (err, results) => {
                console.log("test");
                if (err) {
                    return next(err);
                }
                if (results.user == null) {
                    // No results.
                    const err = new Error("No session in progress.");
                    err.status = 404;
                    return next(err);
                }
                console.log(req.body.size + " test");
                results.item.lowerStock(req.body.size, req.body.amount),
                results.user.addToCart(results.item, req.body.amount, req.body.size),
                
                res.redirect(results.user.url);
            }
        )
        
    }
    
];