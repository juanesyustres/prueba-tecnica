function agruparPorEstado(tareas) {
  const agrupadas = {};

  for (let tarea of tareas) {
    const estado = tarea.estado;

    if (!agrupadas[estado]) {
      agrupadas[estado] = [];
    }

    agrupadas[estado].push(tarea);
  }

  return agrupadas;
}