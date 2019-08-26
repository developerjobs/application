'use strict';

import Db from "../config/db";
import {Tools} from "./Tools"; // en vrai cette table est inutile dû à l'utilisation de tags

const Sequelize = require('sequelize');

const Announces =
    Db.instance.define('announces', {
        position: {type: Sequelize.STRING},
        location: {type: Sequelize.STRING},
        isRemoteFriendly: {type: Sequelize.BOOLEAN, defaultValue: false},
        description: {type: Sequelize.TEXT, defaultValue: ""},
        responsibilities: {type: Sequelize.TEXT, defaultValue: ""},
        requirements: {type: Sequelize.TEXT, defaultValue: ""},
        companyName: {type: Sequelize.STRING},
        companyUrl: {type: Sequelize.STRING},
        contactEmail: {type: Sequelize.STRING,  allowNull: true},
        tags: {
            type: Sequelize.STRING,
            defaultValue: ""
        },
        visibility: {type: Sequelize.BOOLEAN, defaultValue: false} // => false only preview / true paid so can see
    });

// https://sequelize.org/master/manual/associations.html
Announces.hasMany(Tools);
Tools.belongsTo(Announces);

export default Announces;