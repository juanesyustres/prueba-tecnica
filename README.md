PRUEBA TECNICA FULL STACK  


 Proyecto fullStack para la creacion de tareas desarrollada con :
 backend
 -Express
 - node.js (V18+)
 -MySQL

frontend
- React 
-Vite
- Axion (conexion con backend)

Requisitos:
Previamente tener instalado
-node.js 
-MySQL

INSTALACION PROYECTO
- se puede descargar la carpeta del repositorio 
se puede clonar el repositorio desde la terminal :
git clone https://github.com/juanesyustres/prueba-tecnica

BASE DE DATOS
- en el repositorio esta la base de datos , ejecutar en SQL
- en elarchivo .env.example esta la guia , remplazar contraseña por la de la base de datos local

EJECUCION BACKEND:
- npm install
- npm run dev
EJECUCION FRONTEND
- npm install
npm run dev

ENDPOINTS PRINCIPALES BACKEND:
- GET /api/usuarios -> Listar Usuarios
- POST /api/usuarios -> crear usuarios

Tareas:
- GET /api/tareas → listar tareas
- GET /api/tareas/:id → obtener tarea por id
- POST /api/tareas → crear tarea
- PUT /api/tareas/:id → actualizar tarea
- DELETE /api/tareas/:id → eliminar tarea

DESICIONES TECNICAS:
- se uso Express para construir APIs REST
- al principio se estaba usando SQL  management studio pero se decide cambiar a SQL Workbench por su mayor facilidad.
- se implemento validaciones en el backend para asegurar que los datos sean validos
- se organizo el backend con estructura para prevenir errores a futuro
- se utilizo React con Vite para desarrollo frontend
- Se Utilizo Axios para consumir API desde frontend
- se separo frontend en : usuarios/ tareas / estadisticas

NOTA
- backend corriendo en localhost:3001
 frontend correindo en localhost:5173


