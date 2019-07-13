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
const producto_model_1 = require("../models/producto.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const productoRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
//listar productos por categoria
productoRoutes.get('/productosCategoria/:termino', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let termino = req.params.termino;
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const productos = yield producto_model_1.Producto.find({ post: termino })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    producto_model_1.Producto.count({ post: termino }, (err, suma) => {
        res.json({
            ok: true,
            productos,
            pagina,
            suma
        });
    });
}));
//******************************************************************************//
//productos del usuario 
//******************************************************************************//
productoRoutes.get('/productosUsuario/:termino', (req, res) => {
    let termino = req.params.termino;
    producto_model_1.Producto.find({ usuario: termino })
        .populate('post')
        .populate('usuario', '-password')
        .exec((err, productos) => {
        if (!productos) {
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
        producto_model_1.Producto.count({ usuario: termino }, (err, suma) => {
            res.json({
                ok: true,
                productos,
                suma
            });
        });
    });
});
//******************************************************************************//
//crear un productos
//******************************************************************************//
productoRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(this, void 0, void 0, function* () {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
    body.imgs = imagenes;
    producto_model_1.Producto.create(body).then((postDB) => __awaiter(this, void 0, void 0, function* () {
        yield postDB.populate('usuario', '-password')
            .populate('post')
            .execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.json(err);
    });
}));
//******************************************************************************//
//******************************************************************************//
//buscar  producto
//******************************************************************************//
productoRoutes.get('/:id', [autenticacion_1.verificaToken], (req, res) => {
    producto_model_1.Producto.findById(req.params.id)
        .populate('post')
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
//******************************************************************************//
//******************************************************************************//
//actualizar producto
//******************************************************************************//
productoRoutes.post('/actualizar/:id', [autenticacion_1.verificaToken], (req, res) => {
    const id = req.params.id;
    const body = req.body;
    producto_model_1.Producto.findById(id, (err, pDB) => {
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
        pDB.nombre = body.nombre || req.params.nombre;
        pDB.precio = body.precio || req.params.precio;
        pDB.descripcion = body.descripcion || req.params.descripcion;
        pDB.marca = body.marca || req.params.marca;
        pDB.garantia = body.garantia || req.params.garantia;
        pDB.referencia = body.referencia || req.params.referencia;
        pDB.material = body.material || req.params.material;
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
//******************************************************************************//
//******************************************************************************//
//busquedas por terminos
//******************************************************************************//
productoRoutes.get('/buscarT/:termino', autenticacion_1.verificaToken, (req, res) => {
    let termino = req.params.termino;
    const regex = new RegExp(termino, 'i');
    producto_model_1.Producto.find({ nombre: regex })
        .populate('usuario', '-password')
        .exec((err, posts) => {
        if (err) {
            return res.json({
                posts: []
            });
        }
        ;
        res.json({
            ok: true,
            post: posts
        });
    });
});
//******************************************************************************//
//******************************************************************************//
//eliminar poroducto
//******************************************************************************//
productoRoutes.delete('/borrar/:id', autenticacion_1.verificaToken, (req, res) => {
    const id = req.params.id;
    producto_model_1.Producto.findByIdAndRemove(id, (err, poDB) => {
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
//******************************************************************************//
//******************************************************************************//
productoRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => {
    const post = req.post;
    res.json({
        ok: true,
        post
    });
});
//******************************************************************************//
//***************************************************************** */
//mostrar producto por id
//*************************************************************** */
productoRoutes.get('/buscar/:id', (req, res) => {
    producto_model_1.Producto.findById(req.params.id)
        .populate('post')
        .populate('usuario', '-password')
        .exec((err, productos) => {
        if (!productos) {
            return res.json({
                ok: false,
                productos: []
            });
        }
        if (err) {
            return res.json({
                err
            });
        }
        ;
        res.json({
            ok: true,
            producto: productos,
        });
    });
});
exports.default = productoRoutes;
