const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  category: {type: Schema.Types.ObjectId, ref: "Category", required: true},
  price: { type: Number, required: true }, 
  summary: { type: String },
  amountInStock: { type: Number, required: true },
  image: { type: Buffer, required: true },
  imageType: {type: String, required: true}
});

ItemSchema.virtual("url").get(function() {
  return `/catalog/item/${this._id}`;
});
ItemSchema.virtual("imagePath").get(function() {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
});
module.exports = mongoose.model("Item", ItemSchema);