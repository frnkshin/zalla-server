const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
  word: {
    type: String,
    unique: true
  },
  url: String
}, { timestamps: true });

module.exports = mongoose.model('Link', LinkSchema);
