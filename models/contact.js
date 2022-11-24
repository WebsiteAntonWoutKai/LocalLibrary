//nog te implimenteren voor contact form -> zorgen dat geen javascript geinjecteerd kan worden

const { DateTime } = require("luxon");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  email: { type: String, required: true, maxLength: 100 },
  subject: { type: String, required: true, maxLength: 100 },
  message: { type: String, required: true},
  date: { type: Date, default: Date.now() },
});

ContactSchema.virtual("url").get(function() {
  return `/catalog/contact/${this._id}`;
});

ContactSchema.virtual("date_formatted").get(function () {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model("Contact", ContactSchema);