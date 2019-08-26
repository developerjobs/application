'use strict';


const CronJob = require('cron').CronJob;
import {Models} from "../models/index";
import Db from "../config/db";
import * as sequelize from "sequelize";

// remove announces where createdAt is > 40 days (960 hours)
export let jobsTask = new CronJob('* * 960 * * *', async function() {
    try {
        let jobList=  [];
        const jobsToArchive = await Db.instance.query("SELECT * FROM announces WHERE createdAt <= now() - INTERVAL 40 DAY", {type: sequelize.QueryTypes.SELECT});
        if(jobsToArchive){
            for( let x in jobsToArchive){
                jobList.push(jobsToArchive[x])
            }

            if(jobList.length > 0 ){
                // we save to archive and delete if the data is successfully archived
                for( let i in jobList){
                    try{
                       const jobToRemove = await Models.AnnouncesArchive.create({
                           position: jobList[i].position,
                           location: jobList[i].location,
                           companyName: jobList[i].companyName,
                           companyUrl:  jobList[i].companyUrl,
                           isRemoteFriendly:  jobList[i].isRemoteFriendly,
                           description: jobList[i].description,
                           responsibilities: jobList[i].responsibilities,
                           requirements: jobList[i].requirements,
                           tags: jobList[i].tags,
                           contactEmail: jobList[i].contactEmail,
                           visibility: jobList[i].visibility
                       });
                        if(jobToRemove){
                            const rowRemove = await Models.Announces.destroy({ // if success rowRemove must be equal to 1
                                where: {
                                    id: jobList[i].id
                                }});
                            if(rowRemove !== 1){
                                console.log("row not deleted")
                            }
                        }
                    } catch(e){
                        console.log(e);
                    }
                }
            }

        }
    } catch(e){
        console.log(e);
    }

}, null, true,   "Europe/Madrid");

