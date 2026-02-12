import { useEffect, useState } from "react";
import api from "../api/api";

export default function Estadisticas({ usuarioId, refresh }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarStats = async () => {
      try {
        setError("");
        setStats(null);

        const endpoint = usuarioId ? `/api/estadisticas/${usuarioId}` : "/api/estadisticas";
        const res = await api.get(endpoint);

        const porEstado = res.data?.por_estado ?? {
          pendiente: 0,
          en_progreso: 0,
          completada: 0,
        };

        const total =
          (porEstado.pendiente || 0) +
          (porEstado.en_progreso || 0) +
          (porEstado.completada || 0);

        setStats({
          total,
          pendientes: porEstado.pendiente || 0,
          en_progreso: porEstado.en_progreso || 0,
          completadas: porEstado.completada || 0,
        });
      } catch (e) {
        setStats(null);
        setError(e?.response?.data?.error || e?.message || "No se pudieron cargar las estadisticas");
      }
    };

    cargarStats();
  }, [usuarioId, refresh]);

  if (error) {
    return (
      <div className="card">
        <h2>Estadisticas</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card">
        <h2>Estadisticas</h2>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Estadisticas</h2>

      <ul>
        <li>
          <b>Total tareas:</b> {stats.total}
        </li>
        <li>
          <b>Pendientes:</b> {stats.pendientes}
        </li>
        <li>
          <b>En progreso:</b> {stats.en_progreso}
        </li>
        <li>
          <b>Completadas:</b> {stats.completadas}
        </li>
      </ul>
    </div>
  );
}
