import { Router, Request, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Producto } from '../models/producto.model';
import FileSystem from '../classes/file-system';





const productoRoutes =  Router();
const fileSystem = new FileSystem();

//listar productos por categoria

productoRoutes.get('/productosCategoria/:termino', async (req, res) => {

    let  termino = req.params.termino
    let pagina = Number(req.query.pagina) || 1;

    let skip = pagina - 1;
    skip = skip * 10;

    const productos = await Producto.find({post: termino})
    .sort({ _id: -1 })
    .skip( skip )
    .limit(10)
   .populate('usuario', '-password')
   .exec()

    

       Producto.count({post:termino}, (err, suma)=>{

           res.json({
               ok: true,
               productos,
               pagina,
              suma
           });
       })
      
   
   });

//******************************************************************************//

//productos del usuario 
//******************************************************************************//
productoRoutes.get('/productosUsuario/:termino', (req, res) => {

    let  termino = req.params.termino
    let pagina = Number(req.query.pagina) || 1;

    let skip = pagina - 1;
    skip = skip * 10;

    Producto.find({usuario: termino})
    .sort({ _id: -1 })
    .skip( skip )
    .limit(10)
   .populate('usuario', '-password')
   .populate('post')
   .exec((err, productos) =>{
    if(!productos){
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
    
    Producto.count({usuario:termino}, (err, suma)=>{

        res.json({
            ok: true,
            productos,
            pagina,
           suma
        });
    })
   })

   
    

      
   
   });





//******************************************************************************//

//crear un producto
//******************************************************************************//

productoRoutes.post('/', [ verificaToken ], async (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;
    
    const imagenes = fileSystem.imagenesDeTempHaciaPost( req.usuario._id );
    body.imgs = imagenes;


    Producto.create( body ).then( async postDB => {

        await postDB.populate('usuario', '-password')
        .populate('post'    )
        .execPopulate();

        res.json({
            ok: true,
            post: postDB
        });

    }).catch( err => {
        res.json(err)
    });

});
//******************************************************************************//



//******************************************************************************//

//actualizar producto

//******************************************************************************//


productoRoutes.get('/:id', [verificaToken], (req:any, res:Response) => {

    
    Producto.findById(req.params.id)
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


//******************************************************************************//





//******************************************************************************//
//actualizar producto
//******************************************************************************//
productoRoutes.put('/:id',[verificaToken],(req:any,res:Response)=>{

    const id = req.params.id;
    const body = req.body; 

    Producto.findById(id, (err, pDB) =>{
      

        
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

         pDB.nombre = body.nombre ||req.params.nombre;
         pDB.precio = body.precio ||req.params.precio;
         pDB.decripcion = body.decripcion || req.params.decripcion;
         

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


//******************************************************************************//



//******************************************************************************//
//busquedas por terminos
//******************************************************************************//

productoRoutes.get('/buscarT/:termino', verificaToken, (req, res) => {

    let  termino = req.params.termino;
    const regex = new RegExp(termino,'i')
    Producto.find({nombre: regex})
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
//******************************************************************************//


//******************************************************************************//
//eliminar poroducto
//******************************************************************************//

productoRoutes.delete('/borrar/:id',verificaToken,(req,res)=>{
    const id = req.params.id;

    
    Producto.findByIdAndRemove(id,(err, poDB)=>{

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

//******************************************************************************//


//******************************************************************************//

productoRoutes.get('/', [ verificaToken ], ( req: any, res: Response ) => {

    const post = req.post;

    res.json({
        ok: true,
        post
    });

});
//******************************************************************************//

//***************************************************************** */
//mostrar producto por id
//*************************************************************** */

productoRoutes.get('/buscar/:id', async(req:any, res:Response) => {

    let  termino = req.params.id
    await Producto.find({_id: termino})
   .populate('usuario', '-password')
   .populate('post')
   .exec((err,productos)=>{

    if(!productos){
        return res.json({
            ok:false,
            productos:[] 
        })
    }  
    
    if(err){
           return res.json({
            err
           })
               
           
       };

       Producto.count({post:termino}, (err, suma)=>{

           res.json({
               ok: true,
               productos: productos,
              suma
           });
       })
      
   
   });
});




export default productoRoutes;