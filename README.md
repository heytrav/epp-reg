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
in our backend system in the future.

This code is all about end-to-end testing operations like creating contacts
and domains, updating domains, etc.

Please see the ```ideegeo/nodepp``` repository for a detailed description of
commands.

Note that all commands return a *promise* object.

# Dependencies

1.  An instance of RabbitMQ. The ```devel``` configuration assumes this is
    running at ```devel.iwantmyname.com```.
2.  ```nodepp``` installed, running and connected to RabbitMQ.



# Installation

    git clone git@github.com:ideegeo/epp-reg.git
    cd epp-reg
    npm install



# Configuration

    ln -sf `pwd`/config/epp-reg-devel.json `pwd`/config/epp-reg.json

This is for developement environments, however as this is mostly generic
RabbitMQ stuff it can probably be safely copied for production or other
environments.

If you want to change anything, please make a new config file with your
settings and ```ln -sf``` to it. Otherwise you might cause future automated
unit tests to do something unpredictable.


# Testing

    npm test

*Note* see section on **Dependencies** in regards to testing.



