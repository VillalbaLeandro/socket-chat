const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')

const { dbConnection } = require('../database/config')
const { socketController } = require('../sockets/controller')

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads',
        }

        //Conectar a base de datos
        this.conectarDB()

        // Middlewares
        this.middlewares();

        // Rutas de mi app
        this.routes();

        //Sockets
        this.sockets()

    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS 
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio publico
        this.app.use(express.static('public'));

        //Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }
    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        this.app.use(this.paths.categorias, require('../routes/categorias'))
        this.app.use(this.paths.productos, require('../routes/productos'))
        this.app.use(this.paths.usuarios, require('../routes/usuarios'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))
    }

    sockets() {
        this.io.on("connection",(socket) =>  socketController(socket, this.io));
    }
    listen() {

        this.server.listen(this.port, () => {
            console.log();

            console.log(`${'- Servidor corriendo en el puerto:'.bold.yellow}`);
            console.log(`- http://localhost:${this.port}`.blue.bold.underline);
            console.log();
        })
    }
}


module.exports = Server;