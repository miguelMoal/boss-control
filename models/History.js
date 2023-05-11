const { Schema, model } = require("mongoose");

const { getCurrentDate } = require("../helpers");

const HistorySchema = Schema({
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
    default: getCurrentDate(),
    required: true,
  },
});

module.exports = model("History", HistorySchema);
