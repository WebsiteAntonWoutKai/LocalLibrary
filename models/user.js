const { DateTime } = require("luxon");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  email: { type: String, required: true },
  password: { type: String, required: true },
  street: { type: String, required: true, maxLength: 100 },
  number: { type: Number, required: true },
  city: { type: String, required: true, maxLength: 100 },
  country: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  shoppingCart: {
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Item",
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
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

UserSchema.methods.validPassword = function (inputPassword) {
  if (this.password != null) {
    return bcrypt.compareSync(inputPassword, this.password);
  } else {
    return false;
  }
};

UserSchema.methods.addToCart = async function(item) {
  //kijken als item al in cart zit, zo ja haal op waar
  const cartItemIndex = this.shoppingCart.items.findIndex(cp => {
    return cp.itemId.toString() === item._id.toString();
  });

  let newQuantity = 1;

  const updatedCartItems = [...this.shoppingCart.items];

  if (cartItemIndex >= 0) {
    newQuantity = this.shoppingCart.items[cartItemIndex].quantity + 1;
    updatedCartItems[cartItemIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      itemId: item._id,
      quantity: newQuantity
    });
  }

  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return await this.save();
};

UserSchema.methods.removeFromCart = async function(cartId) {
  const updatedCartItems = this.shoppingCart.items.filter(item => {
    return item.itemId.toString() !== cartId.toString();
  });

  const updatedcart = {
    items: updatedCartItems
  };

  this.cart = updatedcart;
  return await this.save();
};

UserSchema.methods.clearCart = async function() {
  this.cart = { items: [] };
  return await this.save();
};

module.exports = mongoose.model("User", UserSchema);