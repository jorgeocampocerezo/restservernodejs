"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    //fecha de creacion
    created: {
        type: Date
    },
    //mensaje de post
    mensaje: {
        type: String
    },
    //imagen de subida
    imgs: [{
            type: String
        }],
    //latidus para la ubicacion 
    coords: {
        type: String
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'debe de existir una referencia a usuario']
    }
});
postSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Post = mongoose_1.model('Post', postSchema);
