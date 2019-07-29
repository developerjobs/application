import Db from "../config/db";

const Sequelize = require('sequelize');

export const Tools = Db.instance.define('tools', {
    name: {type: Sequelize.STRING},
});
