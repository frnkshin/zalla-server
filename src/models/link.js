const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const LinkSchema = new Schema({
  word: {
    type: String,
    unique: true
  },
  url: String
}, {timestamps: true});

module.exports = mongoose.model("Link", LinkSchema);
