var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');


program.version('0.0.1').usage('[options]')
.option('-r, --registry <registry>', 'Registry')
.option('-d, --name <domain>', 'Domain name')
.option('-e,  --expiration <YYYY-mm-dd>').option('-p, --period <int>', 'Registration period', 1).option('-u, --unit <unit>', 'Registration period unit', 'y');
program.parse(process.argv);

var registry = program.registry;
var domain = program.name;
var curExpiration = program.expiration;
var period = program.period;
var unit = program.unit;

var renewDomain = {
    "name": domain,
    "curExpDate": curExpiration,
    "period": {
        "value": period,
        "unit": unit
    }
};

var eppCommander = new EppCommander(registry);
eppCommander.renewDomain(renewDomain).then(function(data) {
    console.log("Renewed domain: ",domain);
    console.log("New expiration data: ", data.data["domain:renData"]["domain:exDate"]);
}).fail(function(error) {
    console.error("Unable to renew domain data: ", error);
}).fin(function() {
    process.exit(0);
});
