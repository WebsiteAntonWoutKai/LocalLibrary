const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
  price: { type: Number, required: true }, 
  summary: { type: String },
  stockLarge: { type: Number, required: true },
  stockMedium: { type: Number, required: true },
  stockSmall: { type: Number, required: true  },
  image: { type: Buffer, required: true },
  imageType: {type: String, required: true}
});

ItemSchema.virtual("url").get(function() {
  return `/catalog/item/${this._id}`;
});
ItemSchema.virtual("adminUrl").get(function() {
  return `/admin/item/${this._id}`;
});


//nog te fixen
ItemSchema.methods.lowerStock = async function(size, amount) {
  let newQuantity = 0;
  var addedToCart = amount * 1; //zodat amount wordt gecast naar Number
  var sizeString = "" + size;

  if (sizeString === "Large") {
    newQuantity = this.stockLarge - addedToCart;
    this.stockLarge = newQuantity;
  }
  if (sizeString === "Medium") {
    newQuantity = this.stockMedium - addedToCart;
    this.stockMedium = newQuantity;
  }
  if (sizeString === "Small") {
    newQuantity = this.stockSmall - addedToCart;
    this.stockSmall = newQuantity;
  }

  return await this.save();
}

//nog te fixen
ItemSchema.methods.upStock = async function(size, amount) {
  let newQuantity = 0;
  let addedToCart = amount * 1; //zodat amount wordt gecast naar Number
  let sizeString = "" + size;

  if (sizeString === "Large") {
    newQuantity = this.stockLarge + addedToCart;
    this.stockLarge = newQuantity;
  }
  if (sizeString === "Medium") {
    newQuantity = this.stockMedium + addedToCart;
    this.stockMedium = newQuantity;
  }
  if (sizeString === "Small") {
    newQuantity = this.stockSmall + addedToCart;
    this.stockSmall = newQuantity;
  }

  return await this.save();
}

ItemSchema.virtual("imagePath").get(function() {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
});
module.exports = mongoose.model("Item", ItemSchema);