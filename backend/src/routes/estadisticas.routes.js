const express = require("express");
const router = express.Router();

const { obtenerEstadisticasUsuario } = require("../controllers/estadisticas.controller");

router.get("/:usuario_id", obtenerEstadisticasUsuario);

module.exports = router;
