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

# Description

Library for posting to the EPP service listening to RabbitMQ. Although mostly
for testing purposes, there will hopefully be some code here worthy of being
in our backend system in the future sometime.  This code is all about
end-to-end testing operations like creating contacts and domains, updating
domains, etc.

Please see the ```ideegeo/nodepp``` repository for a detailed description of
commands.

Note that all commands return a *promise* object.


# Configuration

    ln -sf ./config/epp-reg-devel.json ./config/epp-reg.json

This is for developement environments, however as this is mostly generic
RabbitMQ stuff it can probably be safely copied for production or other
environments.

# Installation

    npm install
    npm test

*Note* see section on **Dependencies** in regards to testing.


# Dependencies

    1.  A local instance of RabbitMQ. By default the configuration assumes
        this is accesible at ```devel.iwantmyname.com```
    2.  ```nodepp``` installed and running. Commands are sent directly over
        nodepp to the registry.






