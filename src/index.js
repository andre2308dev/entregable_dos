import express from "express";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import { _dirname } from "./utils.js";
import GestorMensajes from "./managers/GestorMensajes.js";

const app = express();
const port = 8080;

const httpServer = createServer(app);
const io = new Server(httpServer);

const gestorMensajes = new GestorMensajes(_dirname + "/data/mensajes.json");

app.engine(
  "handlebars",
  engine({
    helpers: {
      eq: (a, b) => a === b,
      inicial: (texto) => (texto || "?").charAt(0).toUpperCase(),
    },
  })
);
app.set("views", _dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(_dirname + "/public"));

app.get("/", (req, res) => {
  res.render("login", { title: "Ingresar" });
});

app.get("/chat", async (req, res) => {
  const username = (req.query.username || "").trim().slice(0, 30);

  if (!username) {
    return res.redirect("/");
  }

  const mensajes = await gestorMensajes.leerMensajes();
  res.render("chat", {
    title: "Chat grupal",
    username,
    mensajes,
    publicidad: {
      titulo: "¡Invita a tus amigos al chat!",
      texto: "Comparte el enlace y conversen todos en tiempo real.",
    },
  });
});

app.use((req, res) => {
  res.status(404).render("error", { title: "No encontrado", mensaje: "La página que buscas no existe." });
});

const usuariosConectados = new Map();

io.on("connection", (socket) => {
  socket.on("unirse", (nombre) => {
    usuariosConectados.set(socket.id, nombre);
    socket.broadcast.emit("notificacion", `${nombre} se unió al chat`);
    io.emit("usuarios", [...usuariosConectados.values()]);
  });

  socket.on("nuevoMensaje", async (datos) => {
    try {
      const mensaje = await gestorMensajes.agregarMensaje(datos);
      io.emit("mensaje", mensaje);
    } catch (error) {
      socket.emit("errorChat", error.message);
    }
  });

  socket.on("escribiendo", (nombre) => {
    socket.broadcast.emit("escribiendo", nombre);
  });

  socket.on("disconnect", () => {
    const nombre = usuariosConectados.get(socket.id);
    if (!nombre) return;
    usuariosConectados.delete(socket.id);
    socket.broadcast.emit("notificacion", `${nombre} salió del chat`);
    io.emit("usuarios", [...usuariosConectados.values()]);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
