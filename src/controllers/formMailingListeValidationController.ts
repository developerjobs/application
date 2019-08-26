'use strict';


import * as express from 'express';

import {Models} from '../models/index';
import Mailing from "../models/Mailing";
import isEmail = require("validator/lib/isEmail");
import {first} from "rxjs/internal/operators";


export let formValidationEmailing = (req: express.Request, res: express.Response, next) => {
    let email = req.body.email;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;

    validAsync(email, firstname, lastname).then((data) => {
        if (isEmpty(data)) {
            Models
                .Mailing
                .create({
                    firstname: firstname,
                    lastname: lastname,
                    email: email
                })
                .then((data) => {
                    if (data) {
                        next();
                    } else {
                        res.render("error", {message: "Oups, une erreur est survenue"})
                    }

                })
                .catch(err => {
                    res
                        .render("error", {message: "Une erreur est survenue"})
                })
        } else {
            res
                .status(400)
                .json({errors: data})
        }
    });

};


function validation(email, firstname, lastname) {
    return new Promise((resolve, reject) => {
        let errors = {};
        Models
            .Mailing
            .findOne({
                where: {
                    email: email
                }
            })
            .then((emailData) => {
                if (emailData !== null) {
                    errors["email"] = "Email déjà utilisé";

                    if (firstname && firstname.length > 2) {
                    } else {
                        errors["firstname"] = "Prénom invalide"
                    }

                    if (lastname && lastname.length > 2) {

                    } else {
                        errors["lastname"] = "Nom invalide"
                    }
                    if (isEmpty(errors)) {
                        resolve(errors)
                    } else {
                        resolve(errors)
                    }
                } else {
                    if(email && validateEmail(email)){
                    } else {
                        errors["email"] = "Email invalide"
                    }
                    if (firstname && firstname.length > 2) {
                    } else {
                        errors["firstname"] = "Prénom invalide"
                    }

                    if (lastname && lastname.length > 2) {

                    } else {
                        errors["lastname"] = "Nom invalide"
                    }
                    if (isEmpty(errors)) {
                        resolve(errors)
                    } else {
                        resolve(errors)
                    }
                }
            })
            .catch(err => {
                reject(err);
            })
    })
}


async function validAsync(email, firstname, lastname) {
    try {
        const t = await validation(email, firstname, lastname);

        return t;
    } catch (e) {
    }
};

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}