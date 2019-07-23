import {Schema, Document, model} from 'mongoose';



const productoSchema = new Schema({

    created:{
        type: Date
    },
    nombre:{
        type:String,
    },
    precio:{
        type:Number
    },
    marca:{
        type:String
    },
    garantia:{
        type:String
    },
    referencia:{
        type:String
    },
    material:{
        type:String
    },
    descripcion:{
        type:String
    },imgs:[{
        type:String,
        
    }],
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }




})



productoSchema.pre<IProducto>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IProducto extends Document {
    created: Date;
    nombre:string;
    precio:string;
    descripcion:string;
    img: string[];    
    usuario:string;
    marca:string;
    post:string
    garantia:string;
    referencia:string;
    material:string;
}

export const Producto = model<IProducto>('Producto', productoSchema);


