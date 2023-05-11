const User = require("../models/User");

const stripe = require("stripe")(
  "sk_test_51MIbFPKIMXWjyb0RGU6X9RpKl0PipuBRwxZp2oTUwKqaxfYE6ULquozBP4i3DOUCJwxJx6rnhoRGsT7nbtTnhJ4N00Cc4G9JWZ"
);

const endpointSecret =
  "whsec_079629eca5fe7633b4ba18f84424ba494a3e5875c09449297757e92a977d84d0";

const eventsStripe = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    // Evento de suscripción creada
    case "customer.subscription.created":
      const subscription = event.data.object;
      const user = await User.findOneAndUpdate(
        { customerId: subscription.customer },
        {
          subscriptionId: subscription.id,
          statusSubscription: subscription.status,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          subscriptionCreatedAt: subscription.created,
          subscriptionActive: subscription.status === "active",
        },
        { new: true }
      );
      console.log(
        `Subscription created for user ${user.name}: ${subscription.id}`
      );
      break;

    // Evento de suscripción cancelada
    case "customer.subscription.deleted":
      const subscriptionId = event.data.object.id;
      const canceledAt = event.data.object.canceled_at;
      const userSubscriptionCanceled = await User.findOneAndUpdate(
        { subscriptionId: subscriptionId },
        {
          statusSubscription: "canceled",
          subscriptionActive: false,
        },
        { new: true }
      );
      console.log(
        `Subscription canceled for user ${userSubscriptionCanceled.name}: ${subscriptionId} at ${canceledAt}`
      );
      break;

    // Evento de error de pago
    case "invoice.payment_failed":
      const customerId = event.data.object.customer;
      const userPaymentFailed = await User.findOneAndUpdate(
        { customerId: customerId },
        {
          statusSubscription: "unpaid",
          subscriptionActive: false,
        },
        { new: true }
      );
      console.log(`Payment failed for user ${userPaymentFailed.name}`);
      break;

    // Otros eventos que no son importantes para el manejo de la suscripción
    case "customer.updated":
    case "customer.deleted":
    case "payment_intent.succeeded":
    case "payment_method.attached":
      console.log(`Not important event: ${event.type}`);
      break;

    // Evento de usuario que cancela su suscripción
    case "customer.subscription.updated":
      const userSubscriptionUpdated = await User.findOneAndUpdate(
        { subscriptionId: event.data.object.id },
        {
          statusSubscription: event.data.object.status,
          subscriptionActive: event.data.object.status === "active",
        },
        { new: true }
      );
      console.log(
        `Subscription updated for user ${userSubscriptionUpdated.name}: ${event.data.object.id}`
      );
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = { eventsStripe };
