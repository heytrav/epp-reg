var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');


program.version('0.0.1').usage('[options]')

.option('-d, --name <domain>', 'Domain name').option('-a, --authinfo [authInfo]', 'AuthInfo', '');

program.parse(process.argv);

var registry = program.registry;
var domain = program.name;
var authInfo = program.authinfo;

var infoDomain = {
    "name": domain,
};
if (authInfo) {
    infoDomain.authInfo = authInfo;
}

var eppCommander = new EppCommander(registry);
eppCommander.infoDomain(infoDomain).then(function(data) {
    var domainData = data.data;
    console.log(domainData);
}).fail(function(error) {
    console.error("Unable to fetch domain data: ", error);
}).fin(function() {
    process.exit(0);
});

