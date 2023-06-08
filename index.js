const express = require("express");
const User = require("./models/User");
//

require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");
const fileUpload = require("express-fileupload");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// //BASE DE DATOS
dbConnection();

app.use(cors());

app.use((req, res, next) => {
  if (req.originalUrl === "/webhooks/stripe") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/auth", require("./routes/Auth.router"));
app.use("/api/product", require("./routes/Product.router"));
app.use("/api/sale", require("./routes/Sale.router"));
app.use("/api/subuser", require("./routes/SubUser.router"));
app.use("/api/analytics", require("./routes/Analytics.router"));
app.use("/api/subscription", require("./routes/Subscription.router"));
app.use("/api/history", require("./routes/History.router"));
app.use("/api/user", require("./routes/User.router"));
// app.use("/webhooks/stripe", require("./routes/WebhookStripe.router"));
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        process.env.WEBHOOK_KEY
      );
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
        console.log(`Subscription created`);
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
        console.log(`Subscription canceled`);
        break;

      // Evento de error de pago
      case "invoice.payment_failed":
        // const customerId = event.data.object.customer;
        // const userPaymentFailed = await User.findOneAndUpdate(
        //   { customerId: customerId },
        //   {
        //     statusSubscription: "unpaid",
        //     subscriptionActive: false,
        //   },
        //   { new: true }
        // );
        console.log(`Payment failed for user`);
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
        console.log(`Subscription updated`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    response.json({ received: true });
  }
);

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en el puerto ${process.env.PORT}`);
});
