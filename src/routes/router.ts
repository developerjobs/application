'use strict';

import * as express from "express";
import {dbInstanceMiddleware} from "../middlewares/Db";

import {Models} from '../models/index';

let Router = express.Router();

Router.get('/', dbInstanceMiddleware, async (req, res, next) => {
    //let db = req["dbInstance"];
    /*
    Models
        .Tools
        .create({name: "salut"});
        */

    res.render('home');
});

Router.get('/jobs', dbInstanceMiddleware, async (req, res, next) => {
    res.render('jobs');
});


export default Router;