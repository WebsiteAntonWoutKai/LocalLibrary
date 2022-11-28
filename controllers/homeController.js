const { body, validationResult } = require("express-validator");
const async = require("async");

exports.index = (req, res) => {
    res.render("layout");
};