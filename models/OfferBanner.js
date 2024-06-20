const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferBannerSchema = new Schema({
  photo: { type: String, default: null },
  heading: { type: String, default: null },
  content: { type: String, default: null },
  button_text: { type: String, default: null },
  button_url: { type: String, default: null },
  position: { type: String, default: null },
  is_guest_user: { type: Boolean, default: false },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OfferBanner', OfferBannerSchema);
