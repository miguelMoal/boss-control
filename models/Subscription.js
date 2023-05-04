const { Schema, model } = require("mongoose");

const SubscriptionSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subscriptionId: { type: String, required: true },
  status: { type: String, required: true },
  currentPeriodStart: { type: Number, required: true },
  currentPeriodEnd: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  active: { type: Boolean },
});

module.exports = model("Subscription", SubscriptionSchema);
