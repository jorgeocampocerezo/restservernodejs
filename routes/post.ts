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

//cuenta posts 

postRoutes.get('/numeroPosts', [verificaToken], (req:any, res:Response) => {

    
    Post.find({})
   .populate('usuario', '-password')
   .exec((err,posts)=>{

     
       if(!posts){
           return res.status(400).json({
               ok:false,
               mensaje: `No gdgfdsgfexiste un post con ese Id ${req.params.id}`,

               
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


//obtener la imagen del post
postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userid;
    const img    = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( userId, img );

    res.sendFile( pathFoto );

});

///actualizar post
postRoutes.put('/:id',[verificaToken],(req:any,res:Response)=>{

    const id = req.params.id;
    const body = req.body; 

    Post.findById(id, (err, pDB) =>{
      

        
        if ( !pDB ) {
            return res.json({
                ok: false,
                mensaje: 'No existe un post  con ese ID'
            });
        }   
           if ( err ) {return res.status(500).json({
            ok:false,
            err
        })
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

postRoutes.get('/:id', [verificaToken], (req:any, res:Response) => {

    
    Post.findById(req.params.id)
   .populate('usuario', '-password')
   .exec((err,posts)=>{

     
       if(!posts){
           return res.status(400).json({
               ok:false,
               mensaje: `No fdfdafdexiste un post con ese Id ${req.params.id}`,

               
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


postRoutes.get('/postUser/:termino', verificaToken, (req, res) => {

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
      
       res.json({
           ok: true,
          post: posts
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

postRoutes.get('/:termino', verificaToken, (req, res) => {

    let  termino = req.params.termino;
    const regex = new RegExp(termino,'i')
    Post.find({mensaje: regex})
   .populate('usuario', '-password')
   .exec((err,posts)=>{

       if(err){
           return res.json({
            posts:[]
           })
               
           
       };
      
       res.json({
           ok: true,
          post: posts
       });
   
   });
});



//eliminar post 

postRoutes.delete('borrar/:id',verificaToken,(req,res)=>{
    const id = req.params.id;

    
    Post.findByIdAndRemove(id,(err, poDB)=>{

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


postRoutes.get('/', [ verificaToken ], ( req: any, res: Response ) => {

    const post = req.post;

    res.json({
        ok: true,
        post
    });

});


export default postRoutes;