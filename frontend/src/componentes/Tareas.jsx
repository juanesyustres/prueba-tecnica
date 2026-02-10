import { useEffect, useState } from "react";
import api from "../api/api";

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Formulario
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [usuarioId, setUsuarioId] = useState("");

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");

  // Cargar usuarios
  const cargarUsuarios = async () => {
    const res = await api.get("/api/usuarios");
    setUsuarios(res.data);
  };

  // Cargar tareas (con filtros)
  const cargarTareas = async () => {
    let url = "/api/tareas?";

    if (filtroEstado) url += `estado=${filtroEstado}&`;
    if (filtroPrioridad) url += `prioridad=${filtroPrioridad}&`;
    if (filtroUsuario) url += `usuario_id=${filtroUsuario}&`;

    const res = await api.get(url);
    setTareas(res.data);
  };

  // ✅ Convertir usuario_id -> nombre
  const nombreUsuario = (id) => {
    const u = usuarios.find((x) => x.id === Number(id));
    return u ? u.nombre : `ID ${id}`;
  };

  // Crear tarea
  const crearTarea = async (e) => {
    e.preventDefault();

    await api.post("/api/tareas", {
      titulo,
      descripcion,
      usuario_id: Number(usuarioId)
    });

    setTitulo("");
    setDescripcion("");
    setUsuarioId("");

    cargarTareas();
  };

  // Eliminar tarea
  const eliminarTarea = async (id) => {
    await api.delete(`/api/tareas/${id}`);
    cargarTareas();
  };

  // Completar tarea
  const completarTarea = async (id) => {
    await api.put(`/api/tareas/${id}`, { estado: "completada" });
    cargarTareas();
  };

  // Cargar al iniciar
  useEffect(() => {
    cargarUsuarios();
    cargarTareas();
  }, []);

  // Volver a cargar cuando cambien filtros
  useEffect(() => {
    cargarTareas();
  }, [filtroEstado, filtroPrioridad, filtroUsuario]);

  return (
    <div className="card">
      <h2>Tareas</h2>

      <h3>Crear tarea</h3>
      <form className="form-row" onSubmit={crearTarea}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} required>
          <option value="">Seleccionar usuario</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre}
            </option>
          ))}
        </select>

        <button className="btn-primary" type="submit">
          Crear tarea
        </button>
      </form>

      <hr />

      <h3>Filtros</h3>
      <div className="form-row">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="pendiente">pendiente</option>
          <option value="en_progreso">en_progreso</option>
          <option value="completada">completada</option>
        </select>

        <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}>
          <option value="">Todas las prioridades</option>
          <option value="baja">baja</option>
          <option value="media">media</option>
          <option value="alta">alta</option>
        </select>

        <select value={filtroUsuario} onChange={(e) => setFiltroUsuario(e.target.value)}>
          <option value="">Todos los usuarios</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre}
            </option>
          ))}
        </select>
      </div>

      <hr />

      <h3>Lista de tareas</h3>

      {tareas.length === 0 ? (
        <p>No hay tareas todavía</p>
      ) : (
        <ul className="lista">
          {tareas.map((t) => (
            <li
              key={t.id}
              style={{ opacity: t.estado === "completada" ? 0.7 : 1 }}
            >
              <div>
                <b>{t.titulo}</b>{" "}
                <span
                  className={
                    t.estado === "pendiente"
                      ? "badge badge-pendiente"
                      : t.estado === "completada"
                      ? "badge badge-completada"
                      : "badge badge-progreso"
                  }
                >
                  {t.estado}
                </span>
                {" "} (Usuario: {nombreUsuario(t.usuario_id)})
              </div>

              <div>
                {/* ✅ si ya está completada, no mostramos completar */}
                {t.estado !== "completada" && (
                  <button className="btn-success" onClick={() => completarTarea(t.id)}>
                    Completar
                  </button>
                )}

                <button className="btn-danger" onClick={() => eliminarTarea(t.id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
