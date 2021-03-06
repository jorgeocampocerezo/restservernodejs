import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';



const postRoutes = Router();
const fileSystem = new FileSystem();

// Obtener POST paginados
postRoutes.get('/', async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const posts = await Post.find()
                            .sort({ _id: -1 })
                            .skip( skip )
                            .limit(10)
                            .populate('usuario', '-password')
                            .exec();


    res.json({
        ok: true,
        pagina,
        posts
    });


});


// Obtener Todos los POST paginados
postRoutes.get('/todos', async (req: any, res: Response) => {


    const posts = await Post.find()
                            .populate('usuario', '-password')
                            .exec();


    res.json({
        ok: true,
        posts
    });


});






//post por id para categoria/feria

postRoutes.get('/feria/:termino', async(req, res) => {

    let  termino = req.params.termino

  
    await Post.findById(termino)
    
   .populate('usuario', '-password')
   .exec((err,posts)=>{

    if(!posts){
        return res.json({
            ok:false,
            posts:[]
        })
    }  
    
    if(err){
           return res.json({
            err
           })
               
           
       };
      
       
           res.json({
            ok: true,
            posts,
      
        

       });
   
   });
});



//cuenta posts 

postRoutes.get('/numeroPosts', [verificaToken], (req:any, res:Response) => {

    
    Post.find({})
   .populate('usuario', '-password')
   .exec((err,posts)=>{

     
       if(!posts){
           return res.status(400).json({
               ok:false,
               mensaje: `No existe un post con ese Id ${req.params.id}`,

               
           })
       }
       if(err){
        return res.status(500).json({
            ok:false,
            err
            
        })
    }
       
    Post.count({}, (err, suma)=>{
        res.json({
            ok: true,
           post: posts,
           suma
        });
    })
   
   });
});
/////





// Crear POST
postRoutes.post('/', [ verificaToken ], (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;

    const imagenes = fileSystem.imagenesDeTempHaciaPost( req.usuario._id );
    body.imgs = imagenes;


    Post.create( body ).then( async postDB => {

        await postDB.populate('usuario', '-password').execPopulate();

        res.json({
            ok: true,
            post: postDB
        });

    }).catch( err => {
        res.json(err)
    });

});



// Servicio para subir archivos
postRoutes.post( '/upload', [ verificaToken ], async (req: any, res: Response) => {
    
    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }

    const file: FileUpload = req.files.image;

    if ( !file ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo - image'
        });
    }

    if ( !file.mimetype.includes('image') ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subió no es una imagen'
        }); 
    }

    await fileSystem.guardarImagenTemporal( file, req.usuario._id );

    res.json({
        ok: true,
        file: file.mimetype
    });

});



//obtener la imagen del postt
postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userid;
    const img    = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( userId, img );

    res.sendFile( pathFoto );

});

///actualizar post
postRoutes.post('/actualizar/:id',[verificaToken],(req:any,res:Response)=>{

    const id = req.params.id;
    const body = req.body; 

    Post.findById(id, (err, pDB) =>{
      

        if ( err ) throw err;
        
        if ( !pDB ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un post  con ese ID'
            });
        }   
        
 

         pDB.gps = body.gps ||req.params.gps;
         pDB.titulo = body.titulo ||req.params.titulo;
         pDB.perfil = body.perfil ||req.params.perfil;
         pDB.organiza = body.organiza ||req.params.organiza;
         pDB.actividades = body.actividades ||req.params.actividades;
         pDB.entrada = body.entrada ||req.params.entrada;
         pDB.descripcion = body.descripcion ||req.params.descripcion;
         pDB.fechas = body.fechas ||req.params.fechas;
         pDB.transporte = body.transporte || req.params.transporte;
         pDB.categoria = body.categoria || req.params.categoria;
         pDB.localidad = body.localidad || req.params.localidad;    
         pDB.referencias = body.referencias || req.params.referencias

         pDB.save((err,pGuardado)=>{


            if ( err ) {res.status(500).json({
                ok:false,
                err
            })
        }

            res.json({
                ok:true,
                producto: pGuardado
            });
         });

    });

});


//mostrar post por id 

postRoutes.get('/:id', (req:any, res:Response) => {

    
    Post.findById(req.params.id)
   .populate('usuario', '-password')
   .exec((err,posts)=>{

     
       if(!posts){
           return res.status(400).json({
               ok:false,
               mensaje: `No existe un post con ese Id ${req.params.id}`,

               
           })
       }
       if(err){
        return res.status(500).json({
            ok:false,
            err
            
        })
    }
       
       res.json({
           ok: true,
          post: posts
       });
   
   });
});


//Busca los post del usuario


postRoutes.get('/postUser/:termino', async(req, res) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 100;
    let  termino = req.params.termino
    await Post.find({usuario: termino})
    .sort({ _id: -1 })
    .skip( skip )
    .limit(100)
   .populate('usuario', '-password')
   .exec((err,posts)=>{

    if(!posts){
        return res.json({
            ok:false,
            posts:[]
        })
    }  
    
    if(err){
           return res.json({
            err
           })
               
           
       };
      
       Post.count( {usuario: termino}, (err,suma) =>{

           res.json({
            ok: true,
            pagina,
            posts,
            suma
       })
        

       });
   
   });
});

//suma los post del usuario
postRoutes.get('/totalUsuarioPost/:termino', verificaToken, (req, res) => {

    let  termino = req.params.termino
    Post.find({usuario: termino})
   .populate('usuario', '-password')
   .exec((err,posts)=>{

    if(!posts){
        return res.json({
            ok:false,
            posts:[]
        })
    }  
    
    if(err){
           return res.json({
            err
           })
               
           
       };

       Post.count({usuario: termino},(err, suma)=>{

           res.json({
               ok: true,
              post: posts,
              suma
           });
    
       })
      
   });
});



//busquedas por terminos 

postRoutes.get('/postCat/:termino', async(req:any, res:Response) => {

    
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    
    let  termino = req.params.termino;
    const regex = new RegExp(termino,'i')
     const posts = await Post.find({categoria: regex})
   .populate('usuario', '-password')
   .sort({ _id: -1 })
                            .skip( skip )
                            .limit(10)
   .exec()

       
       res.json({
           ok: true,
          posts,
          pagina,
       });
   
   });


//eliminar post 

postRoutes.delete('/borrar/:id',   (req:any,res: Response)=>{
    const id = req.params.id;

    
     Post.findByIdAndRemove( id, (err, poDB)=>{

        if(!poDB){
            return res.json({
                ok:false,
                mensaje:'El Id no existe'
            })
        }
        if(err){
            throw err
        }
       res.json({
           ok:true,
           mensaje:'El post fue eliminado'
       })
    });
})

////**suma categorias *//
postRoutes.get('/sumaCat/:categoria', (req:any, res:Response) => {

let  categoria = req.params.categoria

   

         Post.count({categoria: categoria},(err, suma)=>{

           res.json({
               ok: true,
              
              suma
           });
    
       })
      
   });


/////**obtener imagen////////////////////////////////// */


postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userid;
    const img    = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( userId, img );

    res.sendFile( pathFoto );

});


export default postRoutes;