import {Schema,  model, Document} from 'mongoose';

const postSchema = new Schema ({

    //fecha de creacion
    created:{
        type: Date

    },
    //mensaje de post
    mensaje:{
        type: String
    },
    //imagen de subida
    imgs:[{
        type: String

    }],
    //latidus para la ubicacion 
    coords:{
        type:String
    },


    usuario:{
        type:Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true, 'debe de existir una referencia a usuario']    
    }

});


postSchema.pre<IPost>('save', function(next){
    this.created = new Date();
    next();
});


interface IPost extends Document{
    created: Date;
    mensaje: string;
    img: string[];
    coords: string;
    usuario:string;

}


export const Post = model<IPost>('Post', postSchema);