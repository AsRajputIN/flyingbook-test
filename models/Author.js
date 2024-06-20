const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  author_name: { type: String, default: null },
  author_image: { type: String, default: null },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Author', AuthorSchema);
