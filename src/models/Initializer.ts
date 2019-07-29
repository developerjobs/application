'use strict';

const initModel = (Model) => {
// init
    Model
        .sync()
        .then(function() {
        })
        .catch(err => {
            console.log("Init model error", err)
        });
};

export default initModel;