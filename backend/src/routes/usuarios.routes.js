const express = require("express");
const router = express.Router();

const {
  crearUsuario,
  obtenerUsuarios
} = require("../controllers/usuarios.controller");

// POST: crear usuario
router.post("/", crearUsuario);

// GET: obtener usuarios
router.get("/", obtenerUsuarios);

module.exports = router;
