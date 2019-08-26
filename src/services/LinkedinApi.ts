'use strict';

import configuration from "../config/linkedin";

export default class LinkedinApi {


    public Linkedin = require('node-linkedin')(configuration.appId, configuration.secret,configuration.callbackUrl);

    constructor() {
    }

}
