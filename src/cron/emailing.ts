'use strict';
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const sequelize = require('sequelize');

import auth from "../config/mail";
import {Models} from "../models/index";
import Db from "../config/db";
import {globalConfig} from "../config/global";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: auth.login,
        pass: auth.password
    }
});


// 1 week <=> 168h
export let emailingTask = new CronJob('* * 168 * * *', function() {

    Db.instance
        .query(" SELECT * FROM announces WHERE createdAt" +
            " >= now() - INTERVAL 1 DAY", {type: sequelize.QueryTypes.SELECT})
        .then( (jobsRow) => {
            if(jobsRow){
                Models
                    .Mailing
                    .findAll({})
                    .then( (emails) => {
                        if(emails){
                            let emailsList = [];
                            let jobList = [];


                            for( let x in jobsRow){
                                jobList.push({id:jobsRow[x].id, position: jobsRow[x].position })
                            }

                            for( let i in emails){
                                emailsList.push(emails[i].dataValues.email);
                            }

                            if(jobList.length > 0 && emailsList.length > 0){

                                for(let y in emailsList){

                                    const mailOptions = {
                                        from: auth.login, // sender address
                                        to: emailsList[y], // list of receivers
                                        subject: 'DeveloperJobs - Emailing liste', // Subject line
                                        html: '<h2>DeveloperJobs - Offres d\'emplois</h2>' +
                                        '<br>' +
                                        '<p>Bonjour,<br> Toujours à la recherche d\'une perle rare ? ça tombe bien, on vient de recevoir de nouvelle offres d\'emplois ! </p>' +
                                        '<a href="' + globalConfig.prod.url + '">Voir les nouvelles offres d\'emplois</a>'+
                                        '<br>'+
                                        '<br>'+

                                        '<small>Contact</small>'+
                                        '<br>'+
                                        '<small>email : developerjobs.service@gmail.com</small>' + '<br>' +
                                        '<small>site : '+ globalConfig.prod.url +'</small>' +
                                        '<br>' +
                                        '<br>' +

                                        '<small>Merci pour votre fidélité !</small>'
                                    };


                                    transporter.sendMail(mailOptions, function (err, info) {
                                        if(err)
                                            console.log(err);
                                        else
                                            console.log(info);
                                    });
                                }

                            }
                        }
                    })
                    .catch( err => {
                        console.log(err);
                    })
            }
        })
        .catch( err => {
            console.log(err);
        });
}, null, true,   "Europe/Madrid");

