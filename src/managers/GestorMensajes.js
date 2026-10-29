import fs from 'fs';

const MAX_MENSAJES = 100;

class GestorMensajes {

    constructor(rutaArchivo) {
        this.filePath = rutaArchivo;
    }

    async leerMensajes() {
        try {
            const contenido = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(contenido);
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    }

    async guardarMensajes(mensajes) {
        await fs.promises.writeFile(this.filePath, JSON.stringify(mensajes, null, 4));
    }

    async agregarMensaje({ nombre, mensaje }) {
        if (!nombre || !nombre.trim()) throw new Error('El nombre de usuario es obligatorio');
        if (!mensaje || !mensaje.trim()) throw new Error('El mensaje no puede estar vacío');

        const ahora = new Date();
        const nuevoMensaje = {
            nombre: nombre.trim().slice(0, 30),
            mensaje: mensaje.trim().slice(0, 500),
            hora: ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
            fecha: ahora.toISOString()
        };

        const mensajes = (await this.leerMensajes()).concat(nuevoMensaje).slice(-MAX_MENSAJES);
        await this.guardarMensajes(mensajes);

        return nuevoMensaje;
    }
}

export default GestorMensajes;
