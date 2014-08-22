# epp-reg

Backend logic for EPP commands to help with testing and prototyping


# Synopsis

    var EppCommander = require('./lib/epp-commander.js');
    var epp = new EppCommander('nzrs');


    epp.createContact(contactData).then(
        function (okResult) {
            // process data
        },
        function (errorResult) {
            // handle error
        }
    );

# Configuration

    ln -sf ./config/epp-reg-devel.json ./config/epp-reg.json

This is for developement environments, however as this is mostly generic
RabbitMQ stuff it can probably be safely copied for production or other
environments.

# Installation

    npm install
    npm test


# Description

Library for posting to the EPP service listening to RabbitMQ. Although mostly
for testing purposes, there will hopefully be some code here worthy of being
in our backend system in the future sometime.

Please see the ```ideegeo/nodepp``` repository for a detailed description of
commands.


Note that all commands return a *promise* object.




