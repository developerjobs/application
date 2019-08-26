'use strict';

import {Tools} from './Tools';
import Announces from "./Announces";
import Bills from "./Bill";
import Mailing from "./Mailing";
import AnnouncesArchive from "./AnnouncesArchives";

/**
 * Note => ordre est important dû au clé étrangère (sinon erreur il faut init en plusieurs étape)
 *
 */


// Use in route to make operation on model
export const Models = {
    Announces: Announces,
    Tools: Tools,
    Bills: Bills,
    Mailing:Mailing,
    AnnouncesArchive: AnnouncesArchive,

};

// Use on server initialize every tables and columns
export const ModelsArray = [
    Announces,
    Tools,
    Bills,
    Mailing,
    AnnouncesArchive
];

