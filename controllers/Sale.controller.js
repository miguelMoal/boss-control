const Sale = require("../models/Sale");
const Product = require("../models/Product");
const History = require("../models/History");

const sale = async (req, res) => {
  let product = await Product.findById(req.body.productId);
  if (Number(product.available) >= req.body.quantity) {
    try {
      const sale = await Sale.findOne({ user: req.uid });

      if (!sale) {
        const sale = new Sale({
          user: req.uid,
          products: [{ ...req.body }],
        });
        product.available =
          Number(product.available) - Number(req.body.quantity);
        await product.save();
        const history = new History({
          user: req.uid,
          productId: req.body.productId,
          quantity: req.body.quantity,
          amount: Number(req.body.amount) * Number(req.body.quantity),
        });
        await history.save();
        const saleDB = await sale.save();
        return res.status(200).json({
          ok: true,
          msg: saleDB,
        });
      }

      const productIndex = sale.products.findIndex(
        (p) => p.productId.toString() === req.body.productId
      );

      if (productIndex >= 0) {
        sale.products[productIndex].quantity += Number(req.body.quantity);
        sale.products[productIndex].amount +=
          Number(req.body.amount) * Number(req.body.quantity);
      } else {
        sale.products.push({ ...req.body });
      }

      product.available = Number(product.available) - Number(req.body.quantity);
      product.save();
      const history = new History({
        user: req.uid,
        productId: req.body.productId,
        quantity: req.body.quantity,
        amount: Number(req.body.amount) * Number(req.body.quantity),
      });
      await history.save();
      const updatedSale = await sale.save();

      return res.status(200).json({
        ok: true,
        msg: updatedSale,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error when selling",
      });
    }
  } else {
    return res.status(400).json({
      ok: false,
      msg: "Insufficient stock",
    });
  }
};

module.exports = { sale };
