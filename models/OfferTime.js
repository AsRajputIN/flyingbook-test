const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferTimeSchema = new Schema({
  offer_name: { type: String, default: null },
  offer_hour: { type: Number, default: null },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OfferTime', OfferTimeSchema);
