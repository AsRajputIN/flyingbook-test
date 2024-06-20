const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BasketSchema = new Schema({
  cust_id: { type: Number, required: true },
  p_id: { type: Number, required: true },
  qty: { type: Number, required: true },
  type: { type: String, default: 'new' },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Basket', BasketSchema);
