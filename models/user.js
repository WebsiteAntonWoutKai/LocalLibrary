const { DateTime } = require("luxon");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Item = require("../models/item");
const { nextTick } = require("async");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  street: { type: String, maxLength: 100 },
  number: { type: Number },
  city: { type: String, maxLength: 100 },
  country: { type: String, maxLength: 100 },
  date_of_birth: { type: Date },
  shoppingCart: {
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Item",
          //required: true
        },
        name: { type: String },
        imgPath: { type: String },
        price: { type: Number },
        size: { type: String },
        quantity: { type: Number
          //required: true => anders werkt code om een of andere reden niet-> nog uitzoeken waarom
        },
      }
    ]
  },
  isAdmin: { type: Boolean, required: true, default: false},
});

UserSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name){
    fullname = "";
  }
  return fullname;
});

UserSchema.virtual("url").get(function() {
  return `/catalog/user/${this._id}`;
});
UserSchema.virtual("adminUrl").get(function() {
  return `/admin/${this._id}`;
});
UserSchema.virtual("admin").get(function() {
  return this.isAdmin;
});

UserSchema.methods.validPassword = function (inputPassword) {
  if (this.password != null) {
    return bcrypt.compareSync(inputPassword, this.password);
  } else {
    return false;
  }
};

//nog te fixen
UserSchema.methods.addToCart = async function(item, amount, size) {
  const findIndexOfItem = (element) => {
    var sizeString = "" + size;     //omdat toString niet werkt
    var elementIdString = "" + element.itemId;
    var itemIdSize = "" + element.size; 
    var itemIdString = "" + item._id;
    return (itemIdString === elementIdString) && (sizeString === itemIdSize);
  }
  //kijken als item al in cart zit, zo ja haal op waar
  const cartItemIndex = this.shoppingCart.items.findIndex(findIndexOfItem);

  let newQuantity = amount * 1;
  let sizeString = "" + size;
  let imgPath = item.imgPath;

  const updatedCartItems = [...this.shoppingCart.items];

  if (cartItemIndex >= 0) {
    newQuantity = this.shoppingCart.items[cartItemIndex].quantity + amount * 1;
    updatedCartItems[cartItemIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      itemId: item._id,
      price: item.price,
      size: sizeString,
      quantity: newQuantity,
      imgPath: imgPath,
      name: item.name
    });
  }

  const updatedCart = {
    items: updatedCartItems
  };
  this.shoppingCart = updatedCart;
  return await this.save();
};

UserSchema.methods.lowerQuantityItem = async function(item, amount, size) {
  const findIndexOfItem = (element) => {
    var sizeString = "" + size;     //omdat toString niet werkt
    var elementIdString = "" + element.itemId;
    var itemIdSize = "" + element.size; 
    var itemIdString = "" + item._id;
    return (itemIdString === elementIdString) && (sizeString === itemIdSize);
  }
  //kijken als item al in cart zit, zo ja haal op waar
  const cartItemIndex = this.shoppingCart.items.findIndex(findIndexOfItem);

  let newQuantity = amount * 1;

  const updatedCartItems = [...this.shoppingCart.items];

  if (cartItemIndex >= 0) {
    newQuantity = this.shoppingCart.items[cartItemIndex].quantity - amount * 1;
    updatedCartItems[cartItemIndex].quantity = newQuantity;
  }

  const updatedCart = {
    items: updatedCartItems
  };
  this.shoppingCart = updatedCart;
  return await this.save();
};


UserSchema.methods.removeItemFromCart = async function(item, amount, size) {
  const updatedCartItems = this.shoppingCart.items.filter(item => {
    var itemIdString = "" + item.itemId;  //omdat toString niet werkt
    var cartIdString = "" + cartId;
    return itemIdString !== cartIdString;
  });

  const updatedcart = {
    items: updatedCartItems
  };

  this.shoppingCart = updatedcart;
  return await this.save();
};

UserSchema.methods.clearCart = async function() {
  //alle items in shopping cart terug toevoegen bij stock -> niets uit de cart wordt gekocht
  this.shoppingCart.items.forEach(element => {
    Item.findById(element.itemId).exec((err, found_item) => {
      if (err) {
        return next(err);
      }
      if (found_item == null) {
        console.log("Heh??");
        return;
      }
      found_item.upStock(element.size, element.quantity);
    })
  });
  //cart legen
  this.shoppingCart = { items: [] };
  return await this.save();
};

UserSchema.methods.clearCart_checkout = async function () {
    console.log(this.shoppingCart)
    this.shoppingCart = { items: [] };
    return await this.save();
};

UserSchema.methods.getTotalPriceItems = async function() {
  let total = 0;
  this.shoppingCart.items.forEach(element => {
    Item.findById(element.itemId).exec((err, found_item) => {
      if (err) {
        return next(err);
      }
      if (found_item == null) {
        console.log("Heh??");
        return;
      }
      total = total + (element.price * element.quantity);
    })
  });
  return total;
};

UserSchema.methods.getQuantity = async function(item, size) {
  const findIndexOfItem = (element) => {
    var sizeString = "" + size;     //omdat toString niet werkt
    var elementIdString = "" + element.itemId;
    var itemIdSize = "" + element.size; 
    var itemIdString = "" + item._id;
    return (itemIdString === elementIdString) && (sizeString === itemIdSize);
  }
  //kijken als item al in cart zit, zo ja haal op waar
  const cartItemIndex = this.shoppingCart.items.findIndex(findIndexOfItem);

  if (cartItemIndex >= 0) {
    return this.shoppingCart.items[cartItemIndex].quantity;
  }
  else {
    console.log("Item Not Found In Shopping Cart");
    return;
  }

};

module.exports = mongoose.model("User", UserSchema);