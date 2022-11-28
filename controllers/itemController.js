const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const async = require("async");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join('public', Item.imageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
    })

function removeImage(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
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
        res.render('item_list', {
            items: items,
            searchOptions: req.query
            })
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
                .populate("amountInStock")
                .populate("imageName")
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
        res.render("item_detail", {
            name: results.item.name,
            item: results.item,
        });
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
    upload.single('image'),
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
    body("amountInStock")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    
    // Process request after validation and sanitization.
    (req, res, next) => {
        const fileName = req.file != null ? req.file.filename : null;
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            summary: req.body.summary,
            amountInStock: req.body.amountInStock,
            imageName: fileName,
        });

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
                removeImage(results.item.imageName);
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
            req.body.categiry =
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
    body("amountInStock")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);


        const item = new Item({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            summary: req.body.summary,
            amountInStock: req.body.amountInStock,
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