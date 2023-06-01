const { Schema, model } = require("mongoose");

const { getCurrentDate } = require("../helpers");

const SaleSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: new Date(),
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
    default: Math.floor(Date.now() / 1000),
  },
});

module.exports = model("Sale", SaleSchema);
