'use strict';

import * as express from 'express';

export let formValidation = (req: express.Request, res: express.Response, next) => {
    let errorsFormat = {};

    let position = req.body.position;
    let location = req.body.location;
    let companyName = req.body.companyName;
    let companyUrl = req.body.companyUrl; // optional
    let isRemoteFriendly = req.body.isRemoteFriendly;
    let description = req.body.description;
    let responsibilities = req.body.responsibilities;
    let requirements = req.body.requirements;
    let tags = req.body.tags;
    let emailContact = req.body.contactEmail;

    if (!position) {
        errorsFormat["position"] = "Position de l'offre non indiquée"
    }

    if (!emailContact || validateEmail(emailContact) === false) {
        errorsFormat["emailContact"] = "Email de contact indiqué est invalide"
    }

    if (!location) {
        errorsFormat["location"] = "Localisation de l'offre non indiquée"
    }

    if (!companyName) {
        errorsFormat["companyName"] = "Nom de l'entreprise indiqué"
    }

    if (!description) {
        errorsFormat["description"] = "Description non indiquée"
    }

    if (!responsibilities) {
        errorsFormat["responsibilities"] = "Responsabilités du poste non indiquées"
    }

    if (!requirements) {
        errorsFormat["requirements"] = "Compétences du poste non indiquées"
    }


    if (Array.isArray(tags)) {
        if (tags.length === 0) {
            errorsFormat["tags"] = "Tags non selectionés"
        }
    } else {
        errorsFormat["tags"] = "Tags invalide"
    }


    if (isRemoteFriendly !== false && isRemoteFriendly !== true) {
        errorsFormat["tags"] = "Le champs remote est invalide"
    }

    if (validURL(companyUrl) === false || companyUrl === "") {
        errorsFormat["companyUrl"] = "Invalide URL de l'entreprise"
    }


    if (isEmpty(errorsFormat)) {
        next();
    } else {
        res.status(400).json({"errors": errorsFormat});
    }


    // utils methods
    function validURL(myURL) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + //port
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i');
        return pattern.test(myURL);
    }

    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
};