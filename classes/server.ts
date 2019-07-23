
import express from 'express';


export default class Server {

    public app : express.Application;
//antes    public PORT= process.env.PORT || 3000;

    public PORT= process.env.PORT;

    constructor() { 
        this.app = express();
    }

    start( callback: Function ) {
        this.app.listen(  this.PORT, callback );
    }

}