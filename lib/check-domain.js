var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');

function collectDomains(val, domainList) {
    domainList.push(val);
}

var domains = [];
program.version('0.0.1').usage('[options]').option('-d, --name [domain]', 'Domain names', collectDomains, domains).option('-r, --registry <registry>', 'Registry Name');

program.parse(process.argv);

var registry = program.registry;
var domain = program.name;
var eppCommander = new EppCommander(registry);
eppCommander.checkDomain({
    "name": domain
}).then(function(data) {
    var availability = data.data['domain:chkData'];
    console.log(availability);
})
.fail(function(error) {
    console.error("Unable to check domain: ", error);
}).fin(function(){
    process.exit(0);
});

