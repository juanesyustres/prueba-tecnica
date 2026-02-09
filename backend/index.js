const express = require("express");
const cors = require("cors");
const usuariosRoutes = require("./src/routes/usuarios.routes");

require("dotenv").config();

const pool = require("./src/config/db");

const app = express();

// Permite que el backend reciba JSON
app.use(express.json());

// Permite que el frontend se conecte sin bloqueo
app.use(cors());

app.use("/api/usuarios", usuariosRoutes);


// Ruta simple para saber si el backend está vivo
app.get("/", (req, res) => {
  res.send("Backend funcionando correctamente 🚀");
});

// Ruta para probar conexión a MySQL
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows[0].ok });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "No se pudo conectar a MySQL",
      error: error.message
    });
  }
});

// Puerto desde .env
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
