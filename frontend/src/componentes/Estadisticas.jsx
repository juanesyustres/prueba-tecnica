import { useEffect, useState } from "react";
import api from "../api/api";

export default function Estadisticas() {
  const [stats, setStats] = useState(null);

  const cargarStats = async () => {
    const res = await api.get("/api/estadisticas");
    setStats(res.data);
  };

  useEffect(() => {
    cargarStats();
  }, []);

  if (!stats) return <div className="card"><h2>Estadísticas</h2><p>Cargando...</p></div>;

  return (
    <div className="card">
      <h2>Estadísticas</h2>

      <ul>
        <li><b>Total tareas:</b> {stats.total}</li>
        <li><b>Pendientes:</b> {stats.pendientes}</li>
        <li><b>En progreso:</b> {stats.en_progreso}</li>
        <li><b>Completadas:</b> {stats.completadas}</li>
      </ul>
    </div>
  );
}
