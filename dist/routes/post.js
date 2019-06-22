"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
// Obtener POST paginados
postRoutes.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    });
}));
//cuenta posts 
postRoutes.get('/numeroPosts', [autenticacion_1.verificaToken], (req, res) => {
    post_model_1.Post.find({})
        .populate('usuario', '-password')
        .exec((err, posts) => {
        if (!posts) {
            return res.status(400).json({
                ok: false,
                mensaje: `No existe un post con ese Id ${req.params.id}`,
            });
        }
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        post_model_1.Post.count({}, (err, suma) => {
            res.json({
                ok: true,
                post: posts,
                suma
            });
        });
    });
});
/////
// Crear POST
postRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
    body.imgs = imagenes;
    post_model_1.Post.create(body).then((postDB) => __awaiter(this, void 0, void 0, function* () {
        yield postDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.json(err);
    });
});
// Servicio para subir archivos
postRoutes.post('/upload', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo - image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subió no es una imagen'
        });
    }
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
//obtener la imagen del post
postRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
///actualizar post
postRoutes.put('/:id', [autenticacion_1.verificaToken], (req, res) => {
    const id = req.params.id;
    const body = req.body;
    post_model_1.Post.findById(id, (err, pDB) => {
        if (!pDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un post  con ese ID'
            });
        }
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        pDB.gps = body.gps || req.params.gps;
        pDB.titulo = body.titulo || req.params.titulo;
        pDB.perfil = body.perfil || req.params.perfil;
        pDB.organiza = body.organiza || req.params.organiza;
        pDB.actividades = body.actividades || req.params.actividades;
        pDB.entrada = body.entrada || req.params.entrada;
        pDB.descripcion = body.descripcion || req.params.descripcion;
        pDB.fechas = body.fechas || req.params.fechas;
        pDB.transporte = body.transporte || req.params.transporte;
        pDB.categoria = body.categoria || req.params.categoria;
        pDB.localidad = body.localidad || req.params.localidad;
        pDB.referencias = body.referencias || req.params.referencias;
        pDB.save((err, pGuardado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: pGuardado
            });
        });
    });
});
//mostrar post por id 
postRoutes.get('/:id', [autenticacion_1.verificaToken], (req, res) => {
    post_model_1.Post.findById(req.params.id)
        .populate('usuario', '-password')
        .exec((err, posts) => {
        if (!posts) {
            return res.status(400).json({
                ok: false,
                mensaje: `No existe un post con ese Id ${req.params.id}`,
            });
        }
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            post: posts
        });
    });
});
//Busca los post del usuario
postRoutes.get('/postUser/:termino', (req, res) => {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    let termino = req.params.termino;
    post_model_1.Post.find({ usuario: termino })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec((err, posts) => {
        if (!posts) {
            return res.json({
                ok: false,
                posts: []
            });
        }
        if (err) {
            return res.json({
                err
            });
        }
        ;
        post_model_1.Post.count({ usuario: termino }, (err, suma) => {
            res.json({
                ok: true,
                pagina,
                posts,
                suma
            });
        });
    });
});
//suma los post del usuario
postRoutes.get('/totalUsuarioPost/:termino', autenticacion_1.verificaToken, (req, res) => {
    let termino = req.params.termino;
    post_model_1.Post.find({ usuario: termino })
        .populate('usuario', '-password')
        .exec((err, posts) => {
        if (!posts) {
            return res.json({
                ok: false,
                posts: []
            });
        }
        if (err) {
            return res.json({
                err
            });
        }
        ;
        post_model_1.Post.count({ usuario: termino }, (err, suma) => {
            res.json({
                ok: true,
                post: posts,
                suma
            });
        });
    });
});
//busquedas por terminos
postRoutes.get('/postCat/:termino', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    let termino = req.params.termino;
    const regex = new RegExp(termino, 'i');
    const posts = yield post_model_1.Post.find({ categoria: regex })
        .populate('usuario', '-password')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .exec();
    res.json({
        ok: true,
        posts,
        pagina,
    });
}));
//eliminar post 
postRoutes.delete('/borrar/:id', autenticacion_1.verificaToken, (req, res) => {
    const id = req.params.id;
    post_model_1.Post.findByIdAndRemove(id, (err, poDB) => {
        if (!poDB) {
            return res.json({
                ok: false,
                mensaje: 'El Id no existe'
            });
        }
        if (err) {
            throw err;
        }
        res.json({
            ok: true,
            mensaje: 'El post fue eliminado'
        });
    });
});
////**suma categorias */
postRoutes.get('/sumaCat/:categoria', (req, res) => {
    let categoria = req.params.categoria;
    post_model_1.Post.count({ categoria: categoria }, (err, suma) => {
        res.json({
            ok: true,
            suma
        });
    });
});
/////**////////////////////////////////// */
postRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    const post = req.post;
    res.json({
        ok: true,
        post
    });
});
exports.default = postRoutes;
