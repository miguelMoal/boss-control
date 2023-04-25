const History = require("../models/History");
const Sale = require("../models/Sale");
const mongoose = require("mongoose");

const { getDatePeriod, getDateLastDays } = require("../helpers");

const infoPeriods = async (req, res) => {
  const dateLastYear = getDateLastDays(364);
  const dateLast30Days = getDateLastDays(29);
  const dateLast7Days = getDateLastDays(6);
  const dateToday = getDatePeriod();

  const registros = await History.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(req.uid),
        date: { $gte: dateLastYear.init },
      },
    },
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: 0,
        productId: "$products.productId",
        date: "$date",
        name: "$product.name",
        quantity: "$products.quantity",
        amount: "$products.amount",
        priceBuy: "$product.priceBuy",
      },
    },
    {
      $facet: {
        salesLastYear: [
          {
            $match: {
              date: { $gte: dateLastYear.init, $lte: dateLastYear.end },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$amount" },
              price: { $sum: "$priceBuy" },
              name: { $first: "$name" },
              quantity: { $sum: "$quantity" },
            },
          },
          {
            $project: {
              _id: 0,
              totalSales: { $ifNull: ["$totalSales", 0] },
              totalPrice: "$price",
              name: "$name",
              quantity: "$quantity",
            },
          },
        ],
        salesLast30Days: [
          {
            $match: {
              date: { $gte: dateLast30Days.init, $lte: dateLast30Days.end },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$amount" },
              price: { $sum: "$priceBuy" },
              name: { $first: "$name" },
              quantity: { $sum: "$quantity" },
            },
          },
          {
            $project: {
              _id: 0,
              totalSales: { $ifNull: ["$totalSales", 0] },
              totalPrice: "$price",
              name: "$name",
              quantity: "$quantity",
            },
          },
        ],
        salesLast7Days: [
          {
            $match: {
              date: { $gte: dateLast7Days.init, $lte: dateLast7Days.end },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$amount" },
              price: { $sum: "$priceBuy" },
              name: { $first: "$name" },
              quantity: { $sum: "$quantity" },
            },
          },
          {
            $project: {
              _id: 0,
              totalSales: { $ifNull: ["$totalSales", 0] },
              totalPrice: "$price",
              name: "$name",
              quantity: "$quantity",
            },
          },
        ],
        salesToday: [
          {
            $match: {
              date: { $gte: dateToday.init, $lte: dateToday.end },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$amount" },
              price: { $sum: "$priceBuy" },
              name: { $first: "$name" },
              quantity: { $sum: "$quantity" },
            },
          },
          {
            $project: {
              _id: 0,
              totalSales: { $ifNull: ["$totalSales", 0] },
              totalPrice: "$price",
              name: "$name",
              quantity: "$quantity",
            },
          },
        ],
      },
    },
  ]);

  const info = {
    salesLastYear: { ...registros[0].salesLastYear[0] },
    salesLast30Days: { ...registros[0].salesLast30Days[0] },
    salesLast7Days: { ...registros[0].salesLast7Days[0] },
    salesToday: { ...registros[0].salesToday[0] },
  };

  res.status(200).json({
    ok: true,
    msg: info,
  });
};

const getInfoLastWeek = async (req, res) => {
  const date = getDateLastDays();

  const registros = await History.find({
    date: { $gte: date.init, $lte: date.end },
  });

  res.status(200).json({
    ok: true,
    msg: registros,
  });
};

const getInfoLastMonth = async (req, res) => {
  const date = getDateLastDays(29);

  const registros = await History.find({
    date: { $gte: date.init, $lte: date.end },
  });

  res.status(200).json({
    ok: true,
    msg: registros,
  });
};

const getTopSellingProducts = async (req, res) => {
  try {
    const topSellingProducts = await Sale.aggregate([
      // Filtramos las ventas del usuario en cuestión
      {
        $match: {
          user: mongoose.Types.ObjectId(req.uid),
        },
      },
      // Desglosamos el array de productos en documentos individuales
      {
        $unwind: "$products",
      },
      // Agrupamos los documentos por id de producto y calculamos la cantidad y el monto total de ventas
      {
        $group: {
          _id: "$products.productId",
          totalQuantity: { $sum: "$products.quantity" },
          totalAmount: { $sum: "$products.amount" },
        },
      },
      // Realizamos un join con la colección de productos para obtener su información
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      // Ordenamos los resultados de mayor a menor cantidad
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      // Proyectamos solo los campos que nos interesan
      {
        $project: {
          _id: "$_id",
          name: { $first: "$product.name" },
          quantity: "$totalQuantity",
          totalAmount: "$totalAmount",
        },
      },
      // Limitamos los resultados a 5
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({
      ok: true,
      products: topSellingProducts,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error fetching top selling products",
      error,
    });
  }
};

module.exports = {
  infoPeriods,
  getInfoLastWeek,
  getInfoLastMonth,
  getTopSellingProducts,
};
