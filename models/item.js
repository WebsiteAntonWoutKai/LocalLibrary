
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//mogelijkse verbetering voor drie aparte stock attributen -> array met daarin stock-schema's zoals dit
const Stock = new Schema({
    size: {
      type: String,
      required: true,
      enum: ["Large", "Medium", "Small"],
    },
    amount: { type: Number, required: true },
})

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
  price: { type: Number, required: true }, //required geeft aan als field ingegeven moet zijn vooraleer document opgeslaan kan worden
  summary: { type: String },
  stockLarge: { type: Number, required: true },
  stockMedium: { type: Number, required: true },
  stockSmall: { type: Number, required: true },
  //image: { type: String, required: true },
});

ItemSchema.virtual("url").get(function() {
  return `/catalog/item/${this._id}`;
});
ItemSchema.virtual("adminUrl").get(function() {
  return `/admin/item/${this._id}`;
});


//nog te fixen
ItemSchema.methods.lowerStock = async function(size, amount) {
  let newQuantity = 1;

  if (size === "Large") {
    newQuantity = this.stockLarge - amount;
    this.stockLarge = newQuantity;
  }
  if (size === "Medium") {
    newQuantity = this.stockMedium - amount;
    this.stockMedium = newQuantity;
  }
  if (size === "Small") {
    newQuantity = this.stockSmall - amount;
    this.stockSmall = newQuantity;
  }

  return await this.save();
}

module.exports = mongoose.model("Item", ItemSchema);