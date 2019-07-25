"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productoSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    nombre: {
        type: String,
    },
    precio: {
        type: String,
    },
    marca: {
        type: String
    },
    tipo: {
        type: String
    },
    numero: {
        type: String
    },
    garantia: {
        type: String
    },
    referencia: {
        type: String
    },
    material: {
        type: String
    },
    descripcion: {
        type: String
    }, imgs: [{
            type: String,
        }],
    post: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post', required: true },
    usuario: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Usuario' }
});
//imagene
productoSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Producto = mongoose_1.model('Producto', productoSchema);
