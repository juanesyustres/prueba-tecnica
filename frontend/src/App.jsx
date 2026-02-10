import "./App.css";
import Usuarios from "./componentes/Usuarios";
import Tareas from "./componentes/tareas";

export default function App() {
  return (
    <div className="container">
      <h1 className="title">Aplicación ToDo Full Stack</h1>

      <div className="grid-2">
        <Usuarios />
        <Tareas />
      </div>
    </div>
  );
}
