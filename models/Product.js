const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  priceSale: {
    type: String,
    required: true,
  },
  priceBuy: {
    type: String,
    required: true,
  },
  available: {
    type: String,
    required: true,
  },
  preferenceInStock: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Product", ProductSchema);
