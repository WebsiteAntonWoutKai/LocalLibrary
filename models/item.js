const { DateTime } = require("luxon");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  price: { type: Number, required: true }, //required geeft aan als field ingegeven moet zijn vooraleer document opgeslaan kan worden
  summary: { type: String },
  amountInStock: { type: Number, required: true},
  //image: { type: String, required: true },
});

ItemSchema.virtual("url").get(function() {
  return `/catalog/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);