import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';

//para subir archivos es un midelwelrs
import fileUpload from 'express-fileupload'


const server = new Server();








// Body parser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );


//fileUppload

server.app.use(fileUpload());



// Rutas de mi app
server.app.use('/user', userRoutes );
server.app.use('/post', postRoutes );

// Conectar DB
//mongodb+srv://Jorge:$MoNgO12345$@cluster0-lrcxs.mongodb.net/fotos
//mongodb://localhost:27017/fotosgram
mongoose.connect('mongodb+srv://Jorge:$MoNgO12345$@cluster0-lrcxs.mongodb.net/fotos', 
                { useNewUrlParser: true }, function( err ){

   if ( err ){
   console.log('error');
}else{


    console.log('Base de datos ONLINE');

}
});

// Levantar express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});