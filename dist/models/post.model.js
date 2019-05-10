"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    titulo: {
        type: String,
        required: [true, 'El titulo es nesesario']
    },
    imgs: [{
            type: String,
            required: [true, 'La imagen es nesesaria']
        }],
    ubicacion: {
        type: String // -13.313123, 12.3123123
    },
    categoria: {
        type: String,
        required: true
    },
    transporte: {
        type: String
    },
    localidad: {
        type: String
    },
    descripcion: {
        type: String
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una referencia a un usuario']
    }
});
postSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Post = mongoose_1.model('Post', postSchema);
