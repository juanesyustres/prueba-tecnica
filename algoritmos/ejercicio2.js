function obtenerTareasVencidas(tareas) {
  const hoy = new Date();

  return tareas.filter((tarea) => {
    if (!tarea.fecha_vencimiento) return false;

    const fechaVencimiento = new Date(tarea.fecha_vencimiento);

    return (
      fechaVencimiento < hoy &&
      tarea.estado !== "completada"
    );
  });
}