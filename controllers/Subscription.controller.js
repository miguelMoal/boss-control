const stripe = require("../config/configStripe");
const User = require("../models/User");

const createSubscription = async (req, res) => {
  const { paymentMethod } = req.body;
  const { uid } = req;
  let customerExists = false;
  const user = await User.findById(uid);

  const alreadySubscribe = async (id) => {
    const subscriptions = await stripe.subscriptions.list({
      customer: id,
    });
    const sub = subscriptions.data.filter(
      (sub) => sub.id == user.subscriptionId
    );
    if (sub.length > 0) {
      return sub[0].status == "active";
    } else {
      return false;
    }
  };

  const subscribeUser = async (id) => {
    await stripe.paymentMethods.attach(paymentMethod, {
      customer: id || user.customerId,
    });
    await stripe.customers.update(id || user.customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });
    const subscription = await stripe.subscriptions.create({
      customer: id || user.customerId,
      items: [{ price: process.env.PRODUCT_KEY }],
      default_payment_method: user.paymentMethodId,
    });
    user.subscriptionId = subscription.id;
    user.currentPeriodStart = subscription.current_period_start;
    user.currentPeriodEnd = subscription.current_period_end;
    user.statusSubscription = subscription.status;
    user.paymentMethodId = paymentMethod;
    user.subscriptionActive = subscription.status === "active";
    user.cancelAtPeriodEnd = false;
    await user.save();
  };

  try {
    await stripe.customers.retrieve(user.customerId);
    customerExists = true;
  } catch (error) {
    // console.log(error);
  }

  try {
    let subscriptionExist = false;
    if (customerExists) {
      const exist = await alreadySubscribe(user.customerId);
      if (!exist) {
        await subscribeUser();
      } else {
        subscriptionExist = true;
      }
    } else {
      const customer = await stripe.customers.create({
        payment_method: paymentMethod,
        email: user.email,
        invoice_settings: {
          default_payment_method: paymentMethod,
        },
      });
      user.customerId = customer.id;
      user.paymentMethodId = paymentMethod;
      await subscribeUser(customer.id);
    }
    if (!subscriptionExist) {
      res.status(200).json({
        ok: true,
        msg: "The subscription was generated correctly",
      });
    } else {
      res.status(409).json({
        ok: false,
        msg: "Subscription already exist",
      });
    }
  } catch (error) {
    console.log("real>>>>>>", error);
    res.status(500).json({
      ok: false,
      msg: "Error",
    });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.uid);

    // Cancelar la suscripción en Stripe
    const rescan = await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true,
    });
    if (rescan.cancel_at_period_end) {
      user.cancelAtPeriodEnd = rescan.cancel_at_period_end;
      await user.save();
    }

    // Si se ha cancelado correctamente, devolver una respuesta de éxito
    res.status(200).json({
      ok: true,
      msg: "Suscripción cancelada correctamente.",
    });
  } catch (error) {
    console.error("Error al cancelar la suscripción en Stripe:", error);

    // Si ha ocurrido un error, devolver una respuesta de error
    res.status(500).json({
      ok: false,
      msg: "Ha ocurrido un error al cancelar la suscripción.",
    });
  }
};

module.exports = { createSubscription, cancelSubscription };
