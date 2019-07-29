'use strict';

import Db from "../config/db";
import {Tools} from "./Tools";
const Sequelize = require('sequelize');

const Announces =
    Db.instance.define('announces', {
        position: {type: Sequelize.STRING},
        location: {type: Sequelize.STRING},
        isRemoteFriendly: {type: Sequelize.BOOLEAN, defaultValue: false},
        description: {type: Sequelize.TEXT},
        responsibilities: {type: Sequelize.TEXT},
        requirements: {type: Sequelize.TEXT},
        jobType: {type: Sequelize.STRING},
        experienceLevel: {type: Sequelize.STRING},
        region: {type: Sequelize.STRING},
        companyName: {type: Sequelize.STRING},
        companyWebsite: {type: Sequelize.STRING, allowNull: true},
        applicationUrl: {type: Sequelize.STRING, allowNull: true},
        contactEmail: {type: Sequelize.STRING}
    });

// https://sequelize.org/master/manual/associations.html
Announces.hasMany(Tools);
Tools.belongsTo(Announces);

export default Announces;