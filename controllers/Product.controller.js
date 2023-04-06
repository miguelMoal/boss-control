const Product = require("../models/Product");

const getProducts = async (req, res) => {
  //console.log(req.uid);
  const products = await Product.find({ user: req.uid });

  res.status(200).json({
    ok: true,
    msg: products,
  });
};

const createProduct = async (req, res) => {
  const product = new Product(req.body);

  try {
    product.user = req.uid;
    const productDB = await product.save();
    res.status(200).json({
      ok: true,
      product: productDB,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "product could not be created",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );

    if (product.modifiedCount === 0) {
      return res.status(404).json({
        ok: false,
        msg: "The product has not been found or has not been modified",
      });
    }
    const productUpdated = await Product.findById(req.params.id);

    res.status(200).json({
      ok: true,
      msg: "Product updated successfully",
      producto: productUpdated,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error updating the product",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        msg: "The product was not found",
      });
    }
    res.status(200).json({
      ok: true,
      msg: "The product was deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error deleting product",
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
