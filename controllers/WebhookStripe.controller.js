const stripe = require("../config/configStripe");

const eventsStripe = async (req, res) => {
  const event = req.body;
  console.log("event>>>>>>", event);
  //   try {
  //     switch (event.type) {
  //       case "subscription.updated":
  //         const subscription = event.data.object;
  //         // Aquí puedes hacer algo con la suscripción que se ha actualizado, como actualizar su estado en tu base de datos.
  //         break;
  //       default:
  //         // Si recibes un evento que no reconoces, debes ignorarlo o enviar un error al remitente.
  //         console.warn(`Evento de Stripe no reconocido: ${event.type}`);
  //         break;
  //     }
  //     res.sendStatus(200);
  //   } catch (error) {
  //     console.error(`Error al procesar el evento de Stripe: ${error}`);
  //     res.sendStatus(500);
  //   }
  res.status(200).json({ ok: true });
};

module.exports = { eventsStripe };
