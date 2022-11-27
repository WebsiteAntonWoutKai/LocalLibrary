const Category = require("../models/category");
const async = require("async");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");


exports.category_list = function (req, res, next) {
    Category.find()
        .sort([["name", "ascending"]])
        .exec(function (err, list_categories) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render("category_list", {
                title: "Category List",
                category_list: list_categories,
            });
        });
};

exports.category_detail = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.params.id).exec(callback);
            },
            category_items(callback) {
                Item.find({ category: req.params.id }).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                // Error in API usage.
                return next(err);
            }
            if (results.category == null) {
                // No results.
                const err = new Error("Category not found");
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render("category_detail", {
                title: "Category Detail",
                category: results.category,
                category_items: results.category_items,
            });
        }
    );
};

/*
staat nu in adminController
exports.category_create_get = (req, res, next) => {
    res.render("category_form", { title: "Create Category" });
};

exports.category_create_post = [
    // Validate and sanitize the name field.
    body("name", "Category name required").trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        const category = new Category({ name: req.body.name });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render("category_form", {
                title: "Create Category",
                category,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid.
            Category.findOne({ name: req.body.name }).exec((err, found_category) => {
                if (err) {
                    return next(err);
                }

                if (found_category) {

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
        }
    },
];
*/

exports.category_delete_get = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.params.id).exec(callback);
            },
            category_items(callback) {
                Item.find({ category: req.params.id }).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.category == null) {
                // No results.
                res.redirect("/catalog/categories");
            }
            // Successful, so render.
            res.render("category_delete", {
                title: "Delete Category",
                category: results.category,
                category_items: results.category_items,
            });
        }
    );
};


exports.category_delete_post = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.body.categoryid).exec(callback);
            },
            category_items(callback) {
                Item.find({ category: req.body.categoryid }).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            // Success
            if (results.category_items.length > 0) {
                res.render("category_delete", {
                    title: "Delete Category",
                    category: results.category,
                    category_items: results.category_items,
                });
                return;
            }
            Category.findByIdAndRemove(req.body.categoryid, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/catalog/categories");
            });
        }
    );
};

exports.category_update_get = function (req, res, next) {
    Category.findById(req.params.id, function (err, category) {
        if (err) {
            return next(err);
        }
        if (category == null) {
            // No results.
            var err = new Error("Category not found");
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render("category_form", { title: "Update Category", category: category });
    });
};

exports.category_update_post = [
    // Validate and sanitze the name field.
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request .
        const errors = validationResult(req);

        var category = new Category({
            name: req.body.name,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render("category_form", {
                title: "Update Category",
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            Category.findByIdAndUpdate(
                req.params.id,
                category,
                {},
                function (err, thecategory) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect(thecategory.url);
                }
            );
        }
    },
];