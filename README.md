# Chat Grupal

Chat grupal en tiempo real con Express + Handlebars (motor de plantillas) + Socket.IO.

## Cómo ejecutar

```bash
npm install
npm start        # o: npm run dev (se reinicia al guardar)
```

Abrir http://localhost:8080

## Funcionamiento

1. En `/` se ingresa el **username**.
2. En `/chat` se muestra la publicidad, el username y la caja de mensajes.
3. Cada mensaje guarda **nombre, mensaje y hora** y se envía a todos los conectados en tiempo real.

## Estructura

```
src/
├── index.js                 Servidor Express + Handlebars + Socket.IO
├── utils.js                 _dirname
├── managers/
│   └── GestorMensajes.js    Mensajes del chat (nombre, mensaje, hora)
├── data/mensajes.json       Historial del chat
├── views/                   Plantillas (layouts, partials, vistas)
└── public/                  css/ y js/ del navegador
```

Cada `res.render()` recibe todas las variables que usa su plantilla
(title, username, mensajes, publicidad).
