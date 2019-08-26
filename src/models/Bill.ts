'use strict';

import Db from "../config/db";

const Sequelize = require('sequelize');

const Bills = Db.instance.define('bills', {
    chargeId: {type: Sequelize.STRING},
    amount: {type:Sequelize.INTEGER},
    currency: {type: Sequelize.STRING},
    balance_transaction: {type:Sequelize.STRING},
    bill_created: {type: Sequelize.INTEGER},
    zip_code: {type: Sequelize.STRING},
    description: {type: Sequelize.STRING},
    paid: {type:Sequelize.BOOLEAN, defaultValue: false},
    card_brand: {type: Sequelize.STRING},
    card_country: {type: Sequelize.STRING},
    card_expired_month: {type: Sequelize.INTEGER},
    card_expired_year: {type: Sequelize.INTEGER},
    card_last_numbers: {type: Sequelize.STRING},
    receipt_url: {type: Sequelize.STRING},
    refund_url: {type: Sequelize.STRING},
    email_receipt: {type: Sequelize.STRING},
    live_mode: {type: Sequelize.BOOLEAN, defaultValue: false}
});


export default Bills;