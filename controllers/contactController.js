const Contact = require("../models/contact");
const async = require("async");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

  
// Display list of all books.
exports.contact_list = (req, res) => {
res.send("NOT IMPLEMENTED: contact list");
};
  

// Display detail page for a specific Contact.
exports.contact_detail = (req, res, next) => {
    Contact.findById(req.params.id)
        .exec((err, contact) => {
            if (err) {
                return next(err);
            }
            if (contact == null) {
                // No results.
                const err = new Error("Contact form copy not found");
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render("contact_detail", {
                title: "Contact Detail",
                contact: contact,
            });
        });
};

// Display Contact create form on GET.
exports.contact_create_get = (req, res, next) => {
    //uitbreiding: meest voorkomende subjects al klaar zetten in een checkbox
    if (req.session.userid) {
        User.findById(req.session.userid).exec((err, found_user) => {
            if (err) {
                return next(err);
            }
            res.render("contact_form", {
                title: "Contact",
                user: found_user
            });
        })
    }
    else {
        res.render("contact_form", {
            title: "Contact"
        });
    }
};

// Handle Contact create on POST.
exports.contact_create_post = [
    // Validate and sanitize fields.
    body("email")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Email must be specified.")
        .isEmail()
        .withMessage("Must be a valid email address."),
    body("subject")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Subject must be specified."),
    body("message")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Message must be specified."),
    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("contact_form", {
                title: "Contact",
                contact: req.body,
                errors: errors.array(),
            });
            return;
        }
        // Data from form is valid.

        // Create an Contact object with escaped and trimmed data.
        const contact = new Contact({
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message,
        });
        contact.save((err) => {
            if (err) {
                return next(err);
            }
            // Successful - redirect to new contact record.
            res.redirect(contact.url);
        });
    },
];

  
// Display contact delete form on GET.
exports.contact_delete_get = (req, res) => {
res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle contact delete on POST.
exports.contact_delete_post = (req, res) => {
res.send("NOT IMPLEMENTED: contact delete POST");
};

// Display contact update form on GET.
exports.contact_update_get = (req, res) => {
res.send("NOT IMPLEMENTED: contact update GET");
};

// Handle contact update on POST.
exports.contact_update_post = (req, res) => {
res.send("NOT IMPLEMENTED: contact update POST");
};
