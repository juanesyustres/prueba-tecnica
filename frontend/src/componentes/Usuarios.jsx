import { useEffect, useState } from "react";
import api from "../api/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const cargarUsuarios = async () => {
    const res = await api.get("/api/usuarios");
    setUsuarios(res.data);
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    await api.post("/api/usuarios", {
      nombre,
      email
    });

    setNombre("");
    setEmail("");
    cargarUsuarios();
  };

  useEffect(() => {
    let activo = true;

    api
      .get("/api/usuarios")
      .then((res) => {
        if (activo) setUsuarios(res.data);
      })
      .catch(() => {});

    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="card">    
      <h2>Usuarios</h2>

      <form className="form-row" onSubmit={crearUsuario}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn-primary" type="submit">Crear Usuario</button>
      </form>

      <h3>Lista de Usuarios</h3>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nombre} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
