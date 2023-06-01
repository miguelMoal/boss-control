const { Schema, model } = require("mongoose");

const { getCurrentDate } = require("../helpers");

const UsuarioSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN_ROLE", "USER_ROLE", "SUPER_ROLE"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: new Date(), required: true },
  subscriptionId: { type: String, default: null },
  statusSubscription: { type: String, default: null },
  currentPeriodStart: { type: Number, default: null },
  currentPeriodEnd: { type: Number, default: null },
  subscriptionCreatedAt: { type: Date, default: null },
  subscriptionActive: { type: Boolean, default: false },
  customerId: { type: String, default: null },
  paymentMethodId: { type: String, default: null },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  timestamp: {
    type: Number,
    required: true,
    default: Math.floor(Date.now() / 1000),
  },
});

module.exports = model("User", UsuarioSchema);
