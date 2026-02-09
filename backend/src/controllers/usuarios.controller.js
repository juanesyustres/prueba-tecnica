const pool = require("../config/db");

// Crear usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email } = req.body;

    // Validación: nombre obligatorio
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    // Validación: email obligatorio
    if (!email || email.trim() === "") {
      return res.status(400).json({ error: "El email es obligatorio" });
    }

    // Insertar usuario en la base de datos
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email) VALUES (?, ?)",
      [nombre, email]
    );

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      id: result.insertId,
      nombre,
      email
    });

  } catch (error) {

    // Si el email está repetido
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Ese email ya está registrado" });
    }

    res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message
    });
  }
};

// Obtener usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const [usuarios] = await pool.query("SELECT * FROM usuarios");
    res.json(usuarios);

  } catch (error) {
    res.status(500).json({
      error: "Error interno del servidor",
      detalle: error.message
    });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios
};
