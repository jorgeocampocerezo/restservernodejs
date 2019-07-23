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
        type: Number
    },
    marca: {
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
//iamgeenes
productoSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Producto = mongoose_1.model('Producto', productoSchema);
