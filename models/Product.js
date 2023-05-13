const { Schema, model } = require("mongoose");

const ProductSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  priceSale: {
    type: Number,
    required: true,
  },
  priceBuy: {
    type: Number,
    required: true,
  },
  available: {
    type: Number,
    required: true,
  },
  preferenceInStock: {
    type: Number,
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
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = model("Product", ProductSchema);
