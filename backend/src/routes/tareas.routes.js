const express = require("express");
const router = express.Router();

const {
  crearTarea,
  listarTareas,
  obtenerTareaPorId,
  actualizarTarea,
  eliminarTarea
} = require("../controllers/tareas.controller");

router.post("/", crearTarea);
router.get("/", listarTareas);
router.get("/:id", obtenerTareaPorId);
router.put("/:id", actualizarTarea);
router.delete("/:id", eliminarTarea);

module.exports = router;
