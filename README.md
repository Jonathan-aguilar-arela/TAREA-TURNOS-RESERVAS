# Sistema de Gestión de Turnos y Reservas

Proyecto desarrollado con **Node.js y Express**, con base de datos en **MongoDB Atlas**.

La aplicación permite consultar servicios de barbería, cabello y spa, revisar su disponibilidad y crear reservas. Incluye vistas con Handlebars y un tablero con actualizaciones en tiempo real.

## Funcionalidades

- Listar servicios y consultar sus detalles.
- Filtrar servicios por categoría y disponibilidad.
- Ordenar por precio, duración o nombre.
- Mostrar resultados con paginación.
- Mostrar los precios en dólares estadounidenses (USD).
- Crear, actualizar y eliminar servicios mediante la API.
- Crear reservas con los datos del cliente, fecha y horario.
- Asociar servicios a una reserva indicando su cantidad.
- Consultar las reservas y los servicios asociados.
- Agregar servicios desde el tablero en tiempo real.
- Actualizar el tablero sin recargar la página mediante Socket.io.
- Validar los datos de entrada con Zod.

## Tecnologías utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Mongoose](https://mongoosejs.com/)
- [Zod](https://zod.dev/)
- [Handlebars](https://handlebarsjs.com/)
- [Socket.io](https://socket.io/)
- Dotenv para las variables de entorno.

## Instalación

Se necesita Node.js, npm y una base de datos en MongoDB Atlas.

Desde la carpeta del proyecto, instalar las dependencias:

```bash
npm install
```

Copiar `.env.example` como `.env` y configurar los valores:

```env
PORT=3200
MONGO_URL=mongodb+srv://USUARIO:CONTRASENA@CLUSTER/?retryWrites=true&w=majority
MONGO_DB_NAME=urban_style
```

Reemplazar los datos de ejemplo por los de tu conexión a MongoDB Atlas.
El archivo `.env`, las credenciales y `node_modules` no deben subirse al repositorio.

## Ejecución del proyecto

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir [http://localhost:3200](http://localhost:3200) en el navegador.
Si se configura otro puerto en `.env`, utilizar ese puerto.

Opcionalmente, ejecutar `npm run seed` para crear o actualizar servicios y reservas de ejemplo.

## Estructura del proyecto

```text
src/
├── config/
├── controllers/
├── dao/
├── middlewares/
├── models/
├── public/
├── repositories/
├── routes/
├── scripts/
├── services/
├── utils/
├── validations/
├── views/
├── app.js
└── server.js
test/
```

La API sigue la arquitectura: `routes → controllers → services → repositories → DAO → models`.

## Base de datos

El proyecto utiliza **MongoDB Atlas y Mongoose** para guardar servicios y reservas.

Las reservas guardan referencias `ObjectId` a los servicios junto con su `quantity`, sin copiar el objeto completo. Al consultar una reserva, se utiliza `populate` para obtener los datos de sus servicios.

## Rutas principales

- `/` — Página principal del sistema.
- `/services` — Servicios con filtros, paginación y ordenamiento.
- `/services/:sid` — Detalle de un servicio.
- `/bookings` — Listado de reservas.
- `/bookings/new?service=<id>` — Formulario para reservar un servicio.
- `/bookings/:bid` — Detalle de una reserva.
- `/realtime` — Tablero de servicios en tiempo real.
- `/api/services` — API de servicios en formato JSON.
- `/api/bookings` — API de reservas en formato JSON.

## Pruebas

Para ejecutar las pruebas automatizadas:

```bash
npm test
```

## Autor

**Jonathan Aguilar**

Correo: [j.aguilar.ab47@gmail.com](mailto:j.aguilar.ab47@gmail.com)
GitHub: [Jonathan-aguilar-arela](https://github.com/Jonathan-aguilar-arela)

## Estado del proyecto

Proyecto desarrollado como entrega final del curso de Backend con Node.js y Express en **CODERHOUSE**.
