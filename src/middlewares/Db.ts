'use strict';

import Db from "../config/db";
import * as express from 'express';


export async function dbInstanceMiddleware(request: express.Request, response: express.Response, next) {
    Db.instance
        .authenticate()
        .then(() => {
            request["dbInstance"] = Db.instance;
            next();
        })
        .catch(err => {
            response.render('error', {message: "Une erreur est survenue, veuillez réessayer plus tard" });
        });
}
