function ordenarTareas(tareas) {
  const ordenPrioridad = {
    alta: 1,
    media: 2,
    baja: 3
  };

  return tareas.sort((a, b) => {
    
    const prioridadA = ordenPrioridad[a.prioridad] || 99;
    const prioridadB = ordenPrioridad[b.prioridad] || 99;

    if (prioridadA !== prioridadB) {
      return prioridadA - prioridadB;
    }

    const fechaA = a.fecha_vencimiento ? new Date(a.fecha_vencimiento) : new Date("9999-12-31");
    const fechaB = b.fecha_vencimiento ? new Date(b.fecha_vencimiento) : new Date("9999-12-31");

    return fechaA - fechaB;
  });
}