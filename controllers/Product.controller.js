const Product = require("../models/Product");
const SubUser = require("../models/SubUser");
const User = require("../models/User");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.userId });
    res.status(200).json({
      ok: true,
      msg: products,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

const createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    product.user = req.userId;
    const productDB = await product.save();
    res.status(200).json({
      ok: true,
      product: productDB,
    });
  } catch (err) {
    console.log(err);
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

const addToStock = async (req, res) => {
  const productId = req.params.id;
  const { toAdd } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (toAdd < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    product.available = Number(product.available) + Number(toAdd);
    await product.save();

    return res
      .status(200)
      .json({ message: "Quantity added successfully", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
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
  addToStock,
};
