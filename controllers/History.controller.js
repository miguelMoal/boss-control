const History = require("../models/History");

const getHistories = async (req, res) => {
  const perPage = req.body.perPage || 10; // Número de documentos por página
  const page = req.body.page || 1; // Número de página actual
  try {
    const count = await History.countDocuments({ user: req.userId }); // Obtener el número total de documentos
    const histories = await History.find({ user: req.userId })
      .populate("products.productId")
      .skip(perPage * page - perPage)
      .limit(perPage);
    res.status(200).json({
      ok: true,
      msg: histories,
      currentPage: page,
      totalPages: Math.ceil(count / perPage),
      totalDocuments: count,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

module.exports = { getHistories };
