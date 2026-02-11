const express = require("express");
const router = express.Router();

const {
  obtenerEstadisticasUsuario,
  obtenerEstadisticasGlobal,
} = require("../controllers/estadisticas.controller");

// IMPORTANTE: primero la ruta "/" y luego "/:usuario_id"
router.get("/", obtenerEstadisticasGlobal);
router.get("/:usuario_id", obtenerEstadisticasUsuario);

module.exports = router;
