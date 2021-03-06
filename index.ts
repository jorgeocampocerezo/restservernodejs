import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import productoRoutes from './routes/producto';
import fileUpload from 'express-fileupload';
import cors from 'cors';
const server = new Server();


// Body parser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );


//file-upload
server.app.use( fileUpload({useTempFiles:true}));

//configurar cors
server.app.use(cors({origin : true, credentials: true}));
//server.app.use(function(req,res,next){
//    res.header("Access-Control-Allow-Origin","*");
//    res.header("Access-Control-Allow-Origin","POST, GET, PUT, DELETE, OPTIONES");
//    res.header("Access-Control-Allow-Origin","Origin, X-Requested-With");
//    next()

//});


// Rutas de mi app
server.app.use('/user', userRoutes );
server.app.use('/posts', postRoutes );
server.app.use('/productos', productoRoutes );



// Conectar DB
mongoose.connect('mongodb+srv://Jorge:$MoNgO12345$@cluster0-lrcxs.mongodb.net/ferias2019?retryWrites=true', 
                { useNewUrlParser: true }, function( err ){

   if ( err ){
   throw err;
}else{


    console.log('Base de datos ONLINE');

}
});
// Levantar express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.PORT }`);
});