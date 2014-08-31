var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');

program.version('0.0.1').usage('[options]').option('-e,  --expiration <YYYY-mm-dd>').option('-p, --period <int>', 'Registration period', 1).option('-u, --unit <unit>', 'Registration period unit', 'y').option('-d, --name <domain>', 'Domain name').option('-r, --registry', 'Registry name');
program.parse(process.argv);


var registry = program.registry;
var domain = program.name;
var period = program.period;
var unit = program.unit;
var curExpiration = program.expiration;

var renewData = {
    "name": domain,
    "curExpDate": curExpiration,
    "period": {
        "value": period,
        "unit": unit
    }
};

var eppCommander = new EppCommander(registry);
eppCommander.renewDomain(renewData).then(function(data) {
    console.log(data.result.msg);
}).fail(function(error) {
    console.error("Unable to renew domain: ", error);
}).fin(function() {
    process.exit(0);
});

