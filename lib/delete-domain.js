var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');


program.version('0.0.1').usage('[options]')
.option('-r, --registry <registry>', 'Registry')
.option('-d, --name <domain>', 'Domain name');

program.parse(process.argv);

var registry = program.registry;
var domain = program.name;

var deleteDomain = {
    "name": domain,
};

var eppCommander = new EppCommander(registry);
eppCommander.deleteDomain(deleteDomain).then(function(data) {
    console.log("Deleted domain: ",domain);
}).fail(function(error) {
    console.error("Unable to delete domain data: ", error);
}).fin(function() {
    process.exit(0);
});

