const Sale = require("../models/Sale");
const Product = require("../models/Product");
const History = require("../models/History");

const sale = async (req, res) => {
  const { products } = req.body;

  const productsToSave = [];

  const promises = products.map(async (p) => {
    const product = await Product.findById(p.productId).lean();
    if (Number(product.available) >= Number(p.quantity)) {
      product.available = Number(product.available) - Number(p.quantity);
      productsToSave.push(product);
      return true;
    } else {
      return false;
    }
  });

  const results = await Promise.all(promises);
  const validStock = results.every((result) => result);

  if (!validStock) {
    return res.status(400).json({
      ok: false,
      msg: "Insufficient stock",
    });
  }

  const currProductsIndexed = productsToSave.reduce(
    (acc, el) => ({
      ...acc,
      [el._id.toString()]: el,
    }),
    {}
  );

  const productsIndexed = products.reduce(
    (acc, el) => ({
      ...acc,
      [el.productId]: el,
    }),
    {}
  );

  const transformProducts = () => {
    const newProducts = productsToSave.map((p) => ({
      ...p,
      quantity: Number(productsIndexed[p._id.toString()].quantity),
      productId: productsIndexed[p._id.toString()].productId,
      amount:
        Number(currProductsIndexed[p._id.toString()].priceSale) *
        Number(productsIndexed[p._id.toString()].quantity),
    }));
    return newProducts;
  };

  const history = new History({
    user: req.uid,
    products: transformProducts(),
  });

  const saveProductsUpdated = async () => {
    for (const product of productsToSave) {
      await Product.updateOne({ _id: product._id }, product);
    }
  };

  try {
    const isSale = await Sale.findOne({ user: req.uid });
    if (!isSale) {
      const sale = new Sale({
        user: req.uid,
        products: transformProducts(),
      });
      saveProductsUpdated();
      await history.save();
      const saleDB = await sale.save();
      return res.status(200).json({
        ok: true,
        msg: saleDB,
      });
    }

    products.forEach((product) => {
      const productIndex = isSale.products.findIndex(
        (sale) => product.productId === sale.productId.toString()
      );

      if (productIndex >= 0) {
        isSale.products[productIndex].quantity += Number(product.quantity);
        isSale.products[productIndex].amount +=
          Number(currProductsIndexed[product.productId].priceSale) *
          Number(product.quantity);
      } else {
        transformProducts().forEach((p) => {
          isSale.products.push(p);
        });
      }
    });
    saveProductsUpdated();
    await history.save();
    const updatedSale = await isSale.save();
    return res.status(200).json({
      ok: true,
      msg: updatedSale,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error when selling",
    });
  }
};

module.exports = { sale };
