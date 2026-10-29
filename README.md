# Tienda – CRUD de productos + Chat grupal

Express + Handlebars (motor de plantillas) + Socket.IO.

## Cómo ejecutar

```bash
npm install
npm start        # o: npm run dev (se reinicia al guardar)
```

Abrir http://localhost:8080

## Rutas

| Método | Ruta                       | Acción CRUD                  |
|--------|----------------------------|------------------------------|
| GET    | `/productos`               | Mostrar (con búsqueda/filtro)|
| GET    | `/productos/:id`           | Leer un producto             |
| GET    | `/productos/nuevo`         | Formulario para crear        |
| POST   | `/productos`               | Crear                        |
| GET    | `/productos/:id/editar`    | Formulario para modificar    |
| POST   | `/productos/:id/editar`    | Modificar                    |
| POST   | `/productos/:id/eliminar`  | Eliminar                     |
| GET    | `/chat`                    | Formulario de username / chat grupal |

## Estructura

```
src/
├── index.js                 Servidor Express + Handlebars + Socket.IO
├── utils.js                 _dirname
├── routes/productos.router.js
├── managers/
│   ├── GestorProductos.js   CRUD sobre data/productos.json
│   └── GestorMensajes.js    Mensajes del chat (nombre, mensaje, hora)
├── data/                    productos.json, mensajes.json
├── views/                   Plantillas (layouts, partials, vistas)
└── public/                  css/ y js/ del navegador
```

Cada `res.render()` recibe todas las variables que usa su plantilla
(título, productos, categorías, mensajes, username, publicidad, etc.).
# Tarea1
