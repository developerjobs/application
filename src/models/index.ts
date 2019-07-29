'use strict';

import {Tools} from './Tools';
import Announces from "./Announces";


/**
 * Note => ordre est important dû au clé étrangère (sinon erreur il faut init en plusieurs étape)
 *
 */


// Use in route to make operation on model
export const Models = {
    Announces: Announces,
    Tools: Tools,
};

// Use on server initialize every tables and columns
export const ModelsArray = [
    Announces,
    Tools,
];

