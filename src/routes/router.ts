'use strict';

import * as express from "express";
import {dbInstanceMiddleware} from "../middlewares/Db";

import {Models} from '../models/index';
import {async} from "rxjs/internal/scheduler/async";

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

Router.get('/test', dbInstanceMiddleware, async (req,res,next) => {

    Models.Announces.findByPk(1).then( (announce) => {
        let tool = Models.Tools.create({
            name: "TOOLS DE FDP 2",
            announceId: 1
        });
    });
   res.send("ok");
});


export default Router;