'use strict';

// Application bootstrap
import App from "./www/App";

import {emailingTask} from "./cron/emailing";
import {jobsTask} from "./cron/jobs";

// Application config
import {globalConfig} from "./config/global";
const PORT = globalConfig.dev.port;

// CRON tasks (send email for emailing list every 168 H emailing)
emailingTask.start();
// CRON tasks (remove every offers older than 40 days);
jobsTask.start();

//middleware for 404 and 500
// That apply if endpoint dosnt exist only
App
    .use( (req,res,next) => {
        res
            .render("error", {message: "Une erreur est survenue, veuillez réessayer plus tard" })
    });

App.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
});
