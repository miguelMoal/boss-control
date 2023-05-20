const stripe = require("../config/configStripe");
const User = require("../models/User");

const createSubscription = async (req, res) => {
  const { paymentMethod } = req.body;
  const { uid } = req;
  const user = await User.findById(uid);

  try {
    let customerExists = true;

    // Verificar si el cliente existe en Stripe
    try {
      await stripe.customers.retrieve(user.customerId);
    } catch (error) {
      customerExists = false;
    }

    // Verificar si el cliente ya tiene una suscripción activa
    const alreadySubscribed = async (customerId) => {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
      });

      return subscriptions.data.some((sub) => sub.status === 'active');
    };

    // Crear o actualizar el cliente y suscribirlo
    const subscribeUser = async (customerId) => {
      await stripe.paymentMethods.attach(paymentMethod, {
        customer: customerId || user.customerId,
      });

      await stripe.customers.update(customerId || user.customerId, {
        invoice_settings: {
          default_payment_method: paymentMethod,
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customerId || user.customerId,
        items: [{ price: process.env.PRODUCT_KEY }],
        default_payment_method: paymentMethod,
      });

      user.subscriptionId = subscription.id;
      user.currentPeriodStart = subscription.current_period_start;
      user.currentPeriodEnd = subscription.current_period_end;
      user.statusSubscription = subscription.status;
      user.paymentMethodId = paymentMethod;
      user.subscriptionActive = subscription.status === 'active';
      user.cancelAtPeriodEnd = false;

      await user.save();
    };

    let subscriptionExist = false;

    if (customerExists) {
      const isSubscribed = await alreadySubscribed(user.customerId);
      if (!isSubscribed) {
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
        msg: 'The subscription was generated correctly',
      });
    } else {
      res.status(409).json({
        ok: false,
        msg: 'Subscription already exists',
      });
    }
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error',
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
