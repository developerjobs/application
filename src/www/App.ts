import * as express from "express";
import * as bodyParser from "body-parser";


// Models
import initModel from "../models/Initializer";
import {ModelsArray} from "../models/index"

import Router from "../routes/router"

class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        // global
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(express.static('public'));
        this.app.set('view engine', 'ejs');


        //Init DB
        for (let i in ModelsArray) {
            initModel(ModelsArray[i]);
        }

        // router init
        this.app.use(Router);

    }

}

export default new App().app;