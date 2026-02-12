const pool = require("../config/db");

const esFechaPasada = (fechaStr) => {
  if (!fechaStr) return false;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fecha = new Date(fechaStr);
  fecha.setHours(0, 0, 0, 0);

  return fecha < hoy;
};

const usuarioExiste = async (usuarioId) => {
  const [rows] = await pool.query("SELECT id FROM usuarios WHERE id = ?", [usuarioId]);
  return rows.length > 0;
};

const crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, estado, prioridad, fecha_vencimiento, usuario_id } = req.body;

    if (!titulo || titulo.trim() === "") {
      return res.status(400).json({ error: "El titulo es obligatorio" });
    }

    if (!usuario_id) {
      return res.status(400).json({ error: "usuario_id es obligatorio" });
    }

    if (!(await usuarioExiste(usuario_id))) {
      return res.status(400).json({ error: "El usuario_id no existe" });
    }

    if (fecha_vencimiento && esFechaPasada(fecha_vencimiento)) {
      return res.status(400).json({ error: "La fecha_vencimiento no puede ser pasada" });
    }

    const [result] = await pool.query(
      `INSERT INTO tareas (titulo, descripcion, estado, prioridad, fecha_vencimiento, usuario_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        descripcion || null,
        estado || "pendiente",
        prioridad || "media",
        fecha_vencimiento || null,
        usuario_id,
      ]
    );

    return res.status(201).json({
      mensaje: "Tarea creada correctamente",
      id: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno", detalle: error.message });
  }
};

const listarTareas = async (req, res) => {
  try {
    const { estado, prioridad, usuario_id } = req.query;

    let sql = "SELECT * FROM tareas WHERE 1=1";
    const params = [];

    if (estado) {
      sql += " AND estado = ?";
      params.push(estado);
    }
    if (prioridad) {
      sql += " AND prioridad = ?";
      params.push(prioridad);
    }
    if (usuario_id) {
      sql += " AND usuario_id = ?";
      params.push(usuario_id);
    }

    sql += " ORDER BY fecha_creacion DESC";

    const [tareas] = await pool.query(sql, params);
    return res.json(tareas);
  } catch (error) {
    return res.status(500).json({ error: "Error interno", detalle: error.message });
  }
};

const obtenerTareaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM tareas WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: "Error interno", detalle: error.message });
  }
};

const actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, prioridad, fecha_vencimiento, usuario_id } = req.body;

    const [existe] = await pool.query("SELECT id FROM tareas WHERE id = ?", [id]);
    if (existe.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    if (usuario_id && !(await usuarioExiste(usuario_id))) {
      return res.status(400).json({ error: "El usuario_id no existe" });
    }

    if (fecha_vencimiento && esFechaPasada(fecha_vencimiento)) {
      return res.status(400).json({ error: "La fecha_vencimiento no puede ser pasada" });
    }

    const [actual] = await pool.query("SELECT * FROM tareas WHERE id = ?", [id]);
    const tarea = actual[0];

    const nuevoTitulo = titulo !== undefined ? titulo : tarea.titulo;
    const nuevaDescripcion = descripcion !== undefined ? descripcion : tarea.descripcion;
    const nuevoEstado = estado !== undefined ? estado : tarea.estado;
    const nuevaPrioridad = prioridad !== undefined ? prioridad : tarea.prioridad;
    const nuevaFecha =
      fecha_vencimiento !== undefined ? fecha_vencimiento : tarea.fecha_vencimiento;
    const nuevoUsuario = usuario_id !== undefined ? usuario_id : tarea.usuario_id;

    if (!nuevoTitulo || nuevoTitulo.trim() === "") {
      return res.status(400).json({ error: "El titulo no puede quedar vacio" });
    }

    await pool.query(
      `UPDATE tareas
       SET titulo = ?, descripcion = ?, estado = ?, prioridad = ?, fecha_vencimiento = ?, usuario_id = ?
       WHERE id = ?`,
      [nuevoTitulo, nuevaDescripcion, nuevoEstado, nuevaPrioridad, nuevaFecha, nuevoUsuario, id]
    );

    return res.json({ mensaje: "Tarea actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error interno", detalle: error.message });
  }
};

const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM tareas WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    return res.json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error interno", detalle: error.message });
  }
};

module.exports = {
  crearTarea,
  listarTareas,
  obtenerTareaPorId,
  actualizarTarea,
  eliminarTarea,
};
