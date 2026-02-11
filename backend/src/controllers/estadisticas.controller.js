const pool = require("../config/db");

const obtenerEstadisticasUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    // 1) Validar que el usuario exista
    const [userRows] = await pool.query("SELECT id FROM usuarios WHERE id = ?", [usuario_id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 2) Totales por estado
    const [porEstadoRows] = await pool.query(
      `SELECT estado, COUNT(*) AS total
       FROM tareas
       WHERE usuario_id = ?
       GROUP BY estado`,
      [usuario_id]
    );

    const por_estado = { pendiente: 0, en_progreso: 0, completada: 0 };
    porEstadoRows.forEach((r) => {
      por_estado[r.estado] = r.total;
    });

    // 3) Totales por prioridad
    const [porPrioridadRows] = await pool.query(
      `SELECT prioridad, COUNT(*) AS total
       FROM tareas
       WHERE usuario_id = ?
       GROUP BY prioridad`,
      [usuario_id]
    );

    const por_prioridad = { baja: 0, media: 0, alta: 0 };
    porPrioridadRows.forEach((r) => {
      por_prioridad[r.prioridad] = r.total;
    });

    // 4) Tareas vencidas (fecha_vencimiento < hoy y no completadas)
    const [vencidasRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM tareas
       WHERE usuario_id = ?
         AND fecha_vencimiento IS NOT NULL
         AND fecha_vencimiento < CURDATE()
         AND estado <> 'completada'`,
      [usuario_id]
    );

    const vencidas = vencidasRows[0].total;

    // 5) Promedio de días para completar
    // (Solo tareas completadas con fecha_completada)
    const [promRows] = await pool.query(
      `SELECT AVG(DATEDIFF(fecha_completada, fecha_creacion)) AS promedio
       FROM tareas
       WHERE usuario_id = ?
         AND estado = 'completada'
         AND fecha_completada IS NOT NULL`,
      [usuario_id]
    );

    const promedio_dias_completar =
      promRows[0].promedio === null ? 0 : Number(promRows[0].promedio);

    return res.json({
      usuario_id: Number(usuario_id),
      por_estado,
      por_prioridad,
      vencidas,
      promedio_dias_completar
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno", detalle: error.message });
  }
};

module.exports = { obtenerEstadisticasUsuario };
