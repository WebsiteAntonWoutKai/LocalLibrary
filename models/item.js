const mongoose = require("mongoose");
const path = require('path');
const imageBasePath = 'uploads/images'

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
  price: { type: Number, required: true }, 
  summary: { type: String },
  amountInStock: { type: Number, required: true },
  imageName: { type: String, required: true},
});

ItemSchema.virtual("url").get(function() {
  return `/catalog/item/${this._id}`;
});
ItemSchema.virtual("imagePath").get(function() {
    if (this.imageName != null) {
        return path.join('/', imageBasePath, this.imageName);
    }
});
module.exports = mongoose.model("Item", ItemSchema);
module.exports.imageBasePath = imageBasePath