const socket = io();

const username = document.getElementById("chat").dataset.username;
const contenedorMensajes = document.getElementById("mensajes");
const formMensaje = document.getElementById("formMensaje");
const inputMensaje = document.getElementById("inputMensaje");
const contadorUsuarios = document.getElementById("contadorUsuarios");
const escribiendo = document.getElementById("escribiendo");

const bajarScroll = () => {
  contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
};

const crearElemento = (etiqueta, clase, texto) => {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
};

const pintarMensaje = ({ nombre, mensaje, hora }) => {
  document.getElementById("chatVacio")?.remove();

  const fila = crearElemento("div", nombre === username ? "mensaje mensaje--propio" : "mensaje");
  const avatar = crearElemento("span", "avatar avatar--chico", nombre.charAt(0).toUpperCase());
  const burbuja = crearElemento("div", "mensaje__burbuja");
  const meta = crearElemento("div", "mensaje__meta");

  meta.append(crearElemento("strong", "", nombre), crearElemento("span", "", hora));
  burbuja.append(meta, crearElemento("p", "", mensaje));
  fila.append(avatar, burbuja);

  contenedorMensajes.append(fila);
  bajarScroll();
};

const pintarNotificacion = (texto) => {
  contenedorMensajes.append(crearElemento("div", "notificacion", texto));
  bajarScroll();
};

socket.emit("unirse", username);

socket.on("mensaje", pintarMensaje);
socket.on("notificacion", pintarNotificacion);
socket.on("errorChat", (texto) => pintarNotificacion(`⚠ ${texto}`));
socket.on("usuarios", (lista) => {
  contadorUsuarios.textContent = lista.length;
  contadorUsuarios.parentElement.title = lista.join(", ");
});

let temporizador;
socket.on("escribiendo", (nombre) => {
  escribiendo.textContent = `${nombre} está escribiendo...`;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => (escribiendo.textContent = ""), 1500);
});

formMensaje.addEventListener("submit", (e) => {
  e.preventDefault();
  const mensaje = inputMensaje.value.trim();
  if (!mensaje) return;

  socket.emit("nuevoMensaje", { nombre: username, mensaje });
  inputMensaje.value = "";
  inputMensaje.focus();
});

inputMensaje.addEventListener("input", () => socket.emit("escribiendo", username));

bajarScroll();
inputMensaje.focus();
