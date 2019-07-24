
import express from 'express';


export default class Server {

    public app : express.Application;
//antes    public PORT= process.env.PORT || 3000;

    public PORT: number = 3000;


    constructor() { 
        this.app = express();
    }

    start( callback: Function ) {
        this.app.listen(  this.PORT, callback );
    }

}