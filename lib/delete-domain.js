var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');

program.version('0.0.1').usage('[options]').option('-d, --name <domain>', 'Domain name').option('-r, --registry', 'Registry name');
program.parse(process.argv);


var registry = program.registry;
var domain = program.name;

var eppCommander = new EppCommander(registry);
var deleteData = {
    "name": domain
};

eppCommander.deleteDomain(deleteData).then(function(data) {
    console.log(data.result.msg);
}).fail(function(error) {
    console.error("Unable to delete domain: ", error);
}).fin(function() {
    process.exit(0);
});

