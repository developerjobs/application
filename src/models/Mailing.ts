'use strict';

'use strict';

import Db from "../config/db";

const Sequelize = require('sequelize');

const Mailing = Db.instance.define('mailings', {
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type:Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    }
});


export default Mailing;