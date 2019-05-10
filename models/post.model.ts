
import { Schema, Document, model } from 'mongoose';

const postSchema = new Schema({

    created: {
        type: Date
    },
    titulo: {
        type: String,
        required: [ true, 'El titulo es nesesario' ]
    },
    imgs: [{
        type: String,
        required: [ true, 'La imagen es nesesaria' ]

    }],
    ubicacion: {
        type: String   // -13.313123, 12.3123123
    },
    categoria:{

        type:String,
        required:true
    },
    transporte:{
        type:String
    },
    localidad:{
        type:String
    },
    descripcion:{
        type:String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true, 'Debe de existir una referencia a un usuario' ]
    }
});

postSchema.pre<IPost>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IPost extends Document {
    created: Date;
    titulo: string;
    img: string[];
    ubicacion: string;
    localidad:string;
    categoria:string;
    transporte:string;
    descripcion:string;
    usuario: string;
}

export const Post = model<IPost>('Post', postSchema);
