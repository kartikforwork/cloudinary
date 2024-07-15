const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
  imageUrl: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  }
});

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
