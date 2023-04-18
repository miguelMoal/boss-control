const Sale = require("../models/Sale");
const Product = require("../models/Product");
const History = require("../models/History");

const sale = async (req, res) => {
  const { products } = req.body;

  const productsToSave = [];

  const promises = products.map(async (p) => {
    const product = await Product.findById(p.productId);
    if (Number(product.available) >= Number(p.quantity)) {
      // Actualizar propiedades del producto
      product.available = Number(product.available) - Number(p.quantity);
      product.sold = Number(product.sold) + Number(p.quantity);
      // Agregar producto a la matriz de productos a guardar
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

  const transformProducts = () => {
    const newProducts = products.map((p) => ({
      ...p,
      amount:
        Number(currProductsIndexed[p.productId].priceSale) * Number(p.quantity),
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
        isSale.products.push({ ...product });
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
