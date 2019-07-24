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
const producto_1 = __importDefault(require("./routes/producto"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//file-upload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
//configurar cors
server.app.use(cors_1.default({ origin: true, credentials: true }));
//server.app.use(function(req,res,next){
//    res.header("Access-Control-Allow-Origin","*");
//    res.header("Access-Control-Allow-Origin","POST, GET, PUT, DELETE, OPTIONES");
//    res.header("Access-Control-Allow-Origin","Origin, X-Requested-With");
//    next()
//});
// Rutas de mi app
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
server.app.use('/productos', producto_1.default);
// Conectar DB
mongoose_1.default.connect('mongodb+srv://Jorge:$MoNgO12345$@cluster0-lrcxs.mongodb.net/ferias2019?retryWrites=true', { useNewUrlParser: true }, function (err) {
    if (err) {
        throw err;
    }
    else {
        console.log('Base de datos ONLINE');
    }
});
// Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.PORT}`);
});
