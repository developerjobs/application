'use strict';

// Application bootstrap
import App from "./www/App";

// Application config
import {globalConfig} from "./config/global";
const PORT = globalConfig.dev.port;


App.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
});
