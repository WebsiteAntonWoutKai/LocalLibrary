//in dit file komen de operaties die enkel de admin kan uitvoeren, zoals producten toevoegen enzo

const Product = require("../models/item");
const { body, validationResult } = require("express-validator");

exports.addProduct = function (req, res, next) {
    res.send("ADDING OF PRODUCT NOT IMPLIMENTED YET");
};

exports.removeProduct = function (req, res, next) {
    res.send("REMOVING OF PRODUCT NOT IMPLIMENTED YET");
};

exports.updateProduct = function (req, res, next) {
    res.send("UPDATING OF PRODUCT NOT IMPLIMENTED YET");
};

