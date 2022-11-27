const { DateTime } = require("luxon");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
          ref: "item",
          //required: true
        },
        quantity: { type: Number, 
          //required: true => anders werkt code om een of andere reden niet-> nog uitzoeken waarom
        }
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

UserSchema.methods.validPassword = function (inputPassword) {
  if (this.password != null) {
    return bcrypt.compareSync(inputPassword, this.password);
  } else {
    return false;
  }
};

//nog te fixen
UserSchema.methods.addToCart = async function(item, amount) {
  //kijken als item al in cart zit, zo ja haal op waar
  const cartItemIndex = this.shoppingCart.items.findIndex(cp => {
    const cpItemIdString = "" + cp.itemId;  //omdat toString niet werkt
    const itemIdString = "" + item._id;
    return cpItemIdString === itemIdString;
  });

  let newQuantity = 1;

  const updatedCartItems = [this.shoppingCart.items];

  if (cartItemIndex >= 0) {
    newQuantity = this.shoppingCart.items[cartItemIndex].quantity + amount;
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
  this.shoppingCart = updatedCart;
  return await this.save();
};

//code nog fixen
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