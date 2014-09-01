var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');



program.version('0.0.1').usage('[options]').option('-d, --name <domain>', 'Domain name').option('-r, --registry <registry>').option('-p, --period <int>', 'Registration period', 1).option('-u, --unit <unit>', 'Registration period unit', 'y').option('--authinfo [authInfo]', 'AuthInfo').option('-o, --operation <operation>', 'Operation', 'request');

program.parse(process.argv);

var registry = program.registry;
var domain = program.name;
var authInfo = program.authinfo;
var period = program.period;
var unit = program.unit;
var op = program.operation;

var transferDomain = {
    "op": op,
    "name": domain,
    "authInfo": authInfo
};
if (period) {
    transferDomain.period = {
        "unit": unit,
        "value": period
    };
    
}

var eppCommander = new EppCommander(registry);
eppCommander.checkDomain({
    "name": domain
}).then(function(data) {
    var isAvailable = data.data['domain:chkData']['domain:cd']['domain:name'].avail;
    if (isAvailable) {
        throw new Error("Domain does not exist!");
    } else {
        return transferDomain;
    }
})
.then(function(data) {
    return eppCommander.transferDomain(data);
})
.then(function(data) {
    console.log("Initiated transfer for: ", domain);
    console.log(data.data["domain:trnData"]);
}).fail(function(error) {
    console.error("Unable to transfer domain: ", error);
}).fin(function(){
    process.exit(0);
});

