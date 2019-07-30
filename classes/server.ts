
import express from 'express';


export default class Server {

    public app : express.Application;
//antes    public PORT= process.env.PORT || 3000;

    //public PORT: number = 3000;
//    public PORT= process.env.PORT || 3000;
    public PORT= process.env.OPENSHIFT_NODEJS_PORT || 3000;
    public ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";



    constructor() { 
        this.app = express();
    }

    start( callback: Function ) {
        this.app.listen(  this.PORT, callback );
    }

}