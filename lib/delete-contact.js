var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');

program.version('0.0.1').usage('[options]').option('-i, --id <id>', 'Contact id').option('-r, --registry', 'Registry name');
program.parse(process.argv);


var registry = program.registry;
var contact = program.id;

var eppCommander = new EppCommander(registry);
var deleteData = {
    "id": contact
};

eppCommander.deleteContact(deleteData).then(function(data) {
    console.log(data.result.msg);
}).fail(function(error) {
    console.error("Unable to delete contact: ", error);
}).fin(function() {
    process.exit(0);
});

