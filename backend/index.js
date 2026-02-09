const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./src/config/db");

const usuariosRoutes = require("./src/routes/usuarios.routes");
const tareasRoutes = require("./src/routes/tareas.routes");

const app = express(); // ✅ primero se crea app

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/tareas", tareasRoutes);

// Ruta simple para saber si el backend está vivo
app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente 🚀");
});

// Ruta para probar conexión a MySQL
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ estado: "ok", db: rows[0].ok });
  } catch (error) {
    res.status(500).json({
      estado: "error",
      message: "No se pudo conectar a MySQL",
      error: error.message
    });
  }
});

// Puerto
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
