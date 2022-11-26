const Item = require("../models/item");
const User = require("../models/user");

exports.add_item_to_cart_post = function (req, res, next) {
    const { itemId } = req.body;
    const item = Item.findById(itemId);
    req.user.addToCart(item);
    res.redirect("/user/:id/shoppingCart");
  };
  
exports.delete_item_from_cart = function (req, res, next) {
    const { itemId } = req.body;
    req.user.removeFromCart(itemId);
    res.redirect("/user/:id/shoppingCart");  
};