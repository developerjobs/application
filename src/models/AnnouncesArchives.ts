'use strict';


import Db from "../config/db";
const Sequelize = require('sequelize');


const AnnouncesArchive =
    Db.instance.define('announces_archive', {
        position: {type: Sequelize.STRING},
        location: {type: Sequelize.STRING},
        isRemoteFriendly: {type: Sequelize.BOOLEAN, defaultValue: false},
        description: {type: Sequelize.TEXT, defaultValue: ""},
        responsibilities: {type: Sequelize.TEXT, defaultValue: ""},
        requirements: {type: Sequelize.TEXT, defaultValue: ""},
        companyName: {type: Sequelize.STRING},
        companyUrl: {type: Sequelize.STRING},
        contactEmail: {type: Sequelize.STRING},
        tags: {
            type: Sequelize.STRING,
            defaultValue: ""
        },
        visibility: {type: Sequelize.BOOLEAN, defaultValue: false} // => false only preview / true paid so can see
    });

export default AnnouncesArchive;