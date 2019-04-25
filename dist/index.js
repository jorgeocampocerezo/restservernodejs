"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_1 = __importDefault(require("./routes/post"));
//para subir archivos es un midelwelrs
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const server = new server_1.default();
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//fileUppload
server.app.use(express_fileupload_1.default());
// Rutas de mi app
server.app.use('/user', usuario_1.default);
server.app.use('/post', post_1.default);
// Conectar DB
//mongodb+srv://Jorge:$MoNgO12345$@cluster0-lrcxs.mongodb.net/fotos
//mongodb://localhost:27017/fotosgram
mongoose_1.default.connect('mongodb+srv://Jorge:$MoNgO12345$@cluster0-lrcxs.mongodb.net/fotos', { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log('error');
    }
    else {
        console.log('Base de datos ONLINE');
    }
});
// Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
