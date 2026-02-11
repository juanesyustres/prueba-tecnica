import { useEffect, useState } from "react";
import api from "../api/api";

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Formulario
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [usuarioId, setUsuarioId] = useState("");

  const [estado, setEstado] = useState("pendiente");
  const [prioridad, setPrioridad] = useState("media");
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");

  const [editandoId, setEditandoId] = useState(null);

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

  // Convertir usuario_id -> nombre
  const nombreUsuario = (id) => {
    const u = usuarios.find((x) => x.id === Number(id));
    return u ? u.nombre : `ID ${id}`;
  };

  // Crear / Editar tarea
  const onSubmitTarea = async (e) => {
    e.preventDefault();

    const payload = {
      titulo,
      descripcion,
      usuario_id: Number(usuarioId),
      estado,
      prioridad,
      fecha_vencimiento: fechaVencimiento || null
    };

    if (editandoId) {
      await api.put(`/api/tareas/${editandoId}`, payload);
    } else {
      await api.post("/api/tareas", payload);
    }

    // reset formulario
    setEditandoId(null);
    setTitulo("");
    setDescripcion("");
    setUsuarioId("");
    setEstado("pendiente");
    setPrioridad("media");
    setFechaVencimiento("");

    cargarTareas();
  };

  // Eliminar tarea
  const eliminarTarea = async (id) => {
    await api.delete(`/api/tareas/${id}`);
    cargarTareas();
  };

  // Completar tarea (solo cambia estado)
  const completarTarea = async (id) => {
    await api.put(`/api/tareas/${id}`, { estado: "completada" });
    cargarTareas();
  };

  // Editar (cargar en formulario)
  const editarTarea = (t) => {
    setEditandoId(t.id);
    setTitulo(t.titulo);
    setDescripcion(t.descripcion || "");
    setUsuarioId(String(t.usuario_id));
    setEstado(t.estado);
    setPrioridad(t.prioridad);
    setFechaVencimiento(t.fecha_vencimiento ? t.fecha_vencimiento.slice(0, 10) : "");
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setTitulo("");
    setDescripcion("");
    setUsuarioId("");
    setEstado("pendiente");
    setPrioridad("media");
    setFechaVencimiento("");
  };

  // Cargar al iniciar
  useEffect(() => {
    cargarUsuarios();
    cargarTareas();
  }, []);

  // Recargar cuando cambien filtros
  useEffect(() => {
    cargarTareas();
  }, [filtroEstado, filtroPrioridad, filtroUsuario]);

  return (
    <div className="card">
      <h2>Tareas</h2>

      <h3>{editandoId ? "Editar tarea" : "Crear tarea"}</h3>

      <form className="form-row" onSubmit={onSubmitTarea}>
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

        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="pendiente">pendiente</option>
          <option value="en_progreso">en_progreso</option>
          <option value="completada">completada</option>
        </select>

        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}autoComplete="off">
          <option value="baja">baja</option>
          <option value="media">media</option>
          <option value="alta">alta</option>
        </select>

        <input
          type="date"
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
        />

        <button className="btn-primary" type="submit">
          {editandoId ? "Guardar cambios" : "Crear tarea"}
        </button>

        {editandoId && (
          <button className="btn-danger" type="button" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
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
            <li key={t.id} style={{ opacity: t.estado === "completada" ? 0.7 : 1 }}>
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
                {" "}
                — Prioridad: <b>{t.prioridad}</b>
                {t.fecha_vencimiento && (
                  <> — Vence: <b>{t.fecha_vencimiento.slice(0, 10)}</b></>
                )}
                {" "}
                (Usuario: {nombreUsuario(t.usuario_id)})
              </div>

              <div>
                {t.estado !== "completada" && (
                  <button className="btn-success" onClick={() => completarTarea(t.id)}>
                    Completar
                  </button>
                )}

                <button className="btn-primary" onClick={() => editarTarea(t)}>
                  Editar
                </button>

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