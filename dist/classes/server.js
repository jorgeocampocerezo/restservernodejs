"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    constructor() {
        //antes    public PORT= process.env.PORT || 3000;
        //public PORT: number = 3000;
        //    public PORT= process.env.PORT || 3000;
        this.PORT = process.env.OPENSHIFT_NODEJS_PORT || 3000;
        this.ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
        this.app = express_1.default();
    }
    start(callback) {
        this.app.listen(this.PORT, callback);
    }
}
exports.default = Server;
