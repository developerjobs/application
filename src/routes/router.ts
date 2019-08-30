'use strict';


import * as express from "express";
import {dbInstanceMiddleware} from "../middlewares/Db";

import {Models} from '../models/index';
import {formValidation} from "../controllers/formJobValidationController"
import {formValidationEmailing} from "../controllers/formMailingListeValidationController";
import configuration from "../config/jwt";

let Router = express.Router();

import stripeConf from "../config/stripe";
import {globalConfig} from "../config/global";
import Db from "../config/db";
import {config} from "rxjs/index";

const jwt = require('jsonwebtoken');

const stripe = require('stripe');
const Stripe = stripe(stripeConf.privateKey);

//import LinkedinApi from "../services/LinkedinApi";


// TODO ====> OAUTH2 sans authorization via browser : https://developers.google.com/identity/protocols/OAuth2ForDevices
// TODO ====> exactement ca : https://docs.microsoft.com/fr-fr/linkedin/consumer/integrations/self-serve/share-on-linkedin

// request for authorization
/*
Router
    .get('/oauth/linkedin', function(req, res) {
        let linkedin = new LinkedinApi().Linkedin;
        let scope = ['r_emailaddress', 'r_liteprofile', 'w_member_social'];

        // This will ask for permisssions etc and redirect to callback url.
        linkedin.auth.authorize(res, scope, 'state');
    });

// callback with code + state (http://localhost:3000 define in application linkedin developers)
Router
    .get('/callback', (req,res) => {
        let linkedin =
            new LinkedinApi().Linkedin
            .auth
            .getAccessToken( res, req.query.code, req.query.state, (err, results) => {
                if(err){
                    console.log("GET ACCESS ERRROr " , err)
                    res.render("error", {message: "Une erreur est survenue, veuillez réessayer plus tard" } )
                } else {
                    console.log("GET ACCESS SUCCESS" , results);
                    res
                        .redirect("/");
                }
            })
    });
    */

Router.get('/', dbInstanceMiddleware, async (req, res, next) => {
    //let db = req["dbInstance"];
    /*
    Models
        .Tools
        .create({name: "salut"});
        */
    Models
        .Announces
        .findAll({
            order: [
                ["createdAt", "DESC"]
            ],
            where: {
                visibility: true
            }
        })
        .then(async (data) => {
            if (data.length === 0) {
                // aucune offre
                res.render("error", {message: "Aucune offres de job pour le moment ..."})
            } else {
                let monthsPos = {
                    0: "Janvier",
                    1: "Fevrier",
                    2: "Mars",
                    3: "Avril",
                    4: "Mai",
                    5: "Juin",
                    6: "Juillet",
                    7: "Aout",
                    8: "Septembre",
                    9: "Octobre",
                    10: "Novembre",
                    11: "Decembre"
                };

                let display = {
                    Janvier: [],
                    Fevrier: [],
                    Mars: [],
                    Avril: [],
                    Mai: [],
                    Juin: [],
                    Juillet: [],
                    Aout: [],
                    Septembre: [],
                    Octobre: [],
                    Novembre: [],
                    Decembre: [],
                };

                for (let i in data) {
                    display[monthsPos[data[i].dataValues.createdAt.getMonth()]].push(data[i].dataValues);
                }


                try {
                    let lastestJobs = [];
                    const lastestJobRows = await Db.instance.query("SELECT * FROM `announces`  WHERE visibility = 1 ORDER BY createdAt LIMIT 5");
                    for (let x in lastestJobRows) {
                        lastestJobs.push(lastestJobRows[x]);
                    }

                    res.render('home', {monthWithJobs: display, lastestJobs: lastestJobs});

                } catch (e) {
                    res
                        .render("error", {message: "Oups une erreur est survenue"})
                }


            }

        })
        .catch((err) => {
            res.render("error", {
                message: "Oups une erreur est survenue !"
            })
        });
});

Router.get('/jobs', dbInstanceMiddleware, async (req, res, next) => {
    res.render('jobs');
});

Router.post('/jobs', dbInstanceMiddleware, formValidation, async (req, res, next) => {
    // if form validation is fine, generate jwt with id of job (preview only)
    /*jwt.sign({
        data: ""
    }, 'secret', { expiresIn: '1h' });*/

    Models
        .Announces
        .create(
            {
                position: req.body.position,
                location: req.body.location,
                companyName: req.body.companyName,
                companyUrl: req.body.companyUrl,
                isRemoteFriendly: req.body.isRemoteFriendly,
                description: req.body.description,
                responsibilities: req.body.responsibilities,
                requirements: req.body.requirements,
                tags: req.body.tags.toString(),
                contactEmail: req.body.contactEmail,
                visibility: false
            }
        )
        .then((job) => {
            let token = jwt.sign({
                jobId: job.id
            }, configuration.secret, {expiresIn: '1h'});

            res
                .status(200)
                .json({data: token, message: "Access to preview and checkout"});
        })
        .catch(err => {
            if (err) {
                res
                    .render("error")
            }
        });
});

Router.get('/checkout/error', dbInstanceMiddleware, async (req, res, next) => {
    res.render("error_checkout", {message: "Une erreur est survenue, veuillez réessayer plus tard"});
});

Router.get('/checkout/success', dbInstanceMiddleware, async (req, res, next) => {
    if (!req.query.token) {
        res
            .render("error", {message: "Oups cette page n'existe pas"})
    } else {
        jwt.verify(req.query.token, configuration.secret, function (err, decoded) {
            if (err) {
                if (err.name && err.name === "TokenExpiredError") {
                    res.render("error_checkout", {message: "Oups cette page n'existe pas."});
                } else {
                    res.render("error_checkout", {message: "Oups cette page n'existe pas."});
                }
            } else {
                res.render("success_checkout", {
                    message: "Merci pour votre confiance !",
                    jobViewProfileUrl: `/job/view/${decoded.jobId}`
                });
            }
        })

    }
});


Router.get('/checkout', dbInstanceMiddleware, async (req, res, next) => {
    if (req.query.token) {
        jwt.verify(req.query.token, configuration.secret, function (err, decoded) {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    res
                        .status(404)
                        .render('error', {message: "Cette offre a expiré !"});
                } else {
                    res
                        .render('error', {message: "Oups une erreur est survenue !"})
                }

            } else {
                let jobId = decoded.jobId;
                Models
                    .Announces
                    .findByPk(jobId)
                    .then((job) => {
                        if (job) {
                            res
                                .status(200)
                                .render("checkoutPreview", {
                                    job: job,
                                    stripeConfig: stripeConf
                                });
                        } else {
                            // job not exist anymore !
                            res
                                .render('error', {message: "Une erreur est survenue, veuillez réessayer plus tard"})
                        }

                    })
                    .catch((err) => {
                        res
                            .render('error', {message: "Une erreur est survenue, veuillez réessayer plus tard"});
                    })

            }
        })
    } else {
        res
            .status(404)
            .render("error", {message: "Oups cette page n'existe pas ..."});
    }
});

/*
Router.get('/test', dbInstanceMiddleware, async (req, res, next) => {

    Models.Announces.findByPk(1).then((announce) => {
        let tool = Models.Tools.create({
            name: "TOOLS DE FDP 2",
            announceId: 1
        });
    });
    res.send("ok");
});

Router.get('/test2', dbInstanceMiddleware, async (req, res, next) => {

    Models
        .Announces
        .create({
            position: "ezae",
            location: "eaze",
            companyName: "eeeee",
            companyUrl: "ee",
            isRemoteFriendly: true,
            description: "<p>ok</p>",
            responsibilities: "<p>ok</p>",
            requirements: "<p>ok</p>",
            tags: ["MEAN"],
            contactEmail: "sylvain.joly00@gmail.com",
            visibility: false
        });
    res.send("ok");
})*/


Router
    .get('/mailing/liste', async (req, res, next) => {
        res.render("mailing_liste");
    });

Router
    .post('/mailing/liste', formValidationEmailing, async (req, res, next) => {
        res.status(200).json({error: false, message: "Email added successfully"})
    });

Router.post('/create-charge', async (req, res, next) => {
    let tok = req.body.token;
    let emailReceipt = req.body.email;
    let jobId = req.body.jobId;
    if (tok && emailReceipt) {
        console.log("RECEIPT EMAIL", emailReceipt);
        Stripe
            .charges
            .create({
                amount: 499,
                currency: "eur",
                source: tok, // obtained with Stripe.js
                description: `Post new job for ${emailReceipt} / job : ${globalConfig.dev.url}/job?id=${jobId}`,
                receipt_email: emailReceipt,
            }, function (err, charge) {
                if (err) {
                    console.log("errr payment", err);
                    res
                        .render("error")
                } else {

                    Models
                        .Bills
                        .create({
                            chargeId: charge.id,
                            amount: charge.amount,
                            currency: charge.currency,
                            balance_transaction: charge.balance_transaction,
                            bill_created: charge.created,
                            zip_code: charge.billing_details.address.postal_code,
                            description: charge.description,
                            paid: charge.paid,
                            card_brand: charge.payment_method_details.card.brand,
                            card_country: charge.payment_method_details.card.country,
                            card_expired_month: charge.payment_method_details.card.exp_month,
                            card_expired_year: charge.payment_method_details.card.exp_year,
                            card_last_numbers: charge.payment_method_details.card.last4,
                            email_receipt: charge.receipt_email,
                            refund_url: charge.refunds.url,
                            receipt_url: charge.receipt_url,
                            live_mode: charge.livemode
                        })
                        .then((billCreated) => {
                            Models
                                .Bills
                                .findByPk(billCreated.id)
                                .then((bill) => {
                                    if (bill) {
                                        Models
                                            .Announces
                                            .update(
                                                {visibility: true}, //what going to be updated
                                                {where: {id: jobId}} // where clause
                                            )
                                            .then(result => {
                                                res.status(200).json({
                                                    bill_success: "OK",
                                                    status: 200,
                                                    payment_error: false,
                                                    jobProfilUrl: `/job/view/${jobId}`
                                                })
                                            })
                                            .catch(error => {
                                                res.render("error", {message: "Une erreur est survenue, veuillez réessayer plus tard"})
                                            });
                                    } else {
                                        res.render("error", {message: "Une erreur est survenue, veuillez réessayer plus tard"})
                                    }
                                })
                                .catch(err => {
                                    res.render("error", {message: "Une erreur est survenue, veuillez réessayer plus tard"})
                                });
                        })
                        .catch(err => {
                            res.render("error", {message: "Une erreur est survenue, veuillez réessayer plus tard"});
                        });
                }
            });

    } else {
        res
            .render("error", {message: "Une erreur est survenue, veuillez réessayer plus tard"})
    }
});

Router.get('/job/view/:jobId', async (req, res, next) => {
    let jobId = req.params.jobId;

    Models
        .Announces
        .findByPk(jobId)
        .then((job) => {
            if (job) {
                if (job.visibility !== true) {
                    res
                        .render("error", {message: "Oups, cette offre n'existe pas :("})
                } else {
                    res
                        .render("jobDisplay", {job: job})
                }
            } else {
                res
                    .render("error", {message: "Oups, cette offre n'existe pas :("})
            }

        })
        .catch((err) => {
            res
                .render("error", {message: "Une erreur est survenue, veuillez réessayer plus tard"})
        });


});

Router
    .get('/mailing/liste/thanks', async (req, res, next) => {
        res.render("mailing_list_thanks")
    });


export default Router;