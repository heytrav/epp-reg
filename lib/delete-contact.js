var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');


program.version('0.0.1').usage('[options]')
.option('-r, --registry <registry>', 'Registry')
.option('-i, --id <contact id>', 'Contact id');

program.parse(process.argv);

var registry = program.registry;
var contact = program.id;

var deleteContact = {
    "id": contact,
};

var eppCommander = new EppCommander(registry);
eppCommander.deleteContact(deleteContact).then(function(data) {
    console.log("Deleted contact: ",contact);
}).fail(function(error) {
    console.error("Unable to delete contact data: ", error.result.msg.$t);
}).fin(function() {
    process.exit(0);
});

