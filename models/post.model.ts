
import { Schema, Document, model } from 'mongoose';

const postSchema = new Schema({

    created: {
        type: Date
    },
    titulo: {
        type: String,
    },
    imgs: [{
        type: String,

    }],
    gps: {
        type: String   // -13.313123, 12.3123123
    },
    categoria:{

        type:String,
        
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
    perfil:{
        type: String
    },
    fechas:{
        type: String
    },
    horarios:{
        type: String
    },
    actividades:{
        type: String
    },
    referencias:{
        type: String
    },
    entrada:{
        type: String
    },
    organiza:{
        type: String
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
    gps: string;
    localidad:string;
    categoria:string;
    transporte:string;
    descripcion:string;
    usuario: string;
    perfil:string;
    fechas:string;
    actividades:string;
    entrada:string;
    organiza:string;
    referencias:string;
}

export const Post = model<IPost>('Post', postSchema);
