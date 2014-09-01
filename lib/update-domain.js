var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');

function collectNameservers(val, nameservers) {
    nameservers.push(val);
    return nameservers;
}
function collectNsObjects(val, nsObjects) {
    var hostObj = val.split(';');
    var host = hostObj.shift();
    var object = {
        "host": host
    };
    if (hostObj.length) {
        object.addr = hostObj;
    }
    nsObjects.push(object);
}
function collectContacts(val, contacts, type) {
    var contact = {};
    contact[type] = val;
    contacts.push(contact);
}
function collectAdmins(val, adminContacts) {
    return collectContacts(val, adminContacts, 'admin');
}
function collectTechs(val, techContacts) {
    return collectContacts(val, techContacts, 'tech');
}
function collectBillings(val, billingContacts) {
    return collectContacts(val, billingContacts, 'billing');
}

var addContacts = [];
var remContacts = [];
var addNameservers = [];
var remNameservers = [];

program.version('0.0.1').usage('[options]')

.option('-d, --name <domain>', 'Domain name')

.option('-a, --admin [admin]', 'Add Admin contact', collectAdmins, addContacts)

.option('-t, --tech [tech]', 'Add Tech contact', collectTechs, addContacts)

.option('-b, --billing [billing]', 'Add Billing contact', collectBillings, addContacts)

.option('--remtech [tech]', 'Remove Tech contact', collectTechs, remContacts)

.option('--remadmin [admin]', 'Remove Admin contact', collectAdmins, remContacts)

.option('--rembilling [billing]', 'Remove Billing contact', collectBillings, remContacts)

.option('-n, --ns [nameserver]', 'Add Nameservers', collectNameservers, addNameservers)

.option('--nsobj [nameserver object]', 'Add Nameserver object: ns1.host.com;23.44.22.44;67.24.55.22', collectNsObjects, addNameservers)

.option('--remns [nameserver]', 'Remove Nameservers', collectNameservers, remNameservers)

.option('--remnsobj [nameserver object]', 'Remove Nameserver object: ns1.host.com;23.44.22.44;67.24.55.22', collectNsObjects, remNameservers)

.option('-o, --registrant <registrant>', 'Registrant')

.option('-r, --registry <registry>')

.option('-p, --period <int>', 'Registration period')

.option('-u, --unit <unit>', 'Registration period unit', 'y')

.option('--authinfo [authInfo]', 'AuthInfo');

program.parse(process.argv);

var registry = program.registry;
var domain = program.name;
var registrant = program.registrant;
var authInfo = program.authinfo;
var period = program.period;
var unit = program.unit;

var updateDomain = {
    "name": domain
};
if (authInfo || registrant || period) {
    var change = {};
    if (registrant) change.registrant = registrant;
    if (authInfo) change.authInfo = authInfo;
    if (period) {
        change.period = {
            "value": period
        };
        if (unit) change.period.unit = unit;
    }
    updateDomain.chg = change;
}
if ( addNameservers.length || addContacts.length) {
    var add = {};
    if (addNameservers.length) add.ns = addNameservers;
    if (addContacts.length) add.contact = addContacts;
    updateDomain.add = add;
}
if (true || remNameservers.length || remContacts.length) {
    var rem = {};
    if (remNameservers.length) rem.ns = remNameservers;
    if (remContacts.length) rem.contact = remContacts;
    rem.status = [ { "s": "clientHold" } ];
    updateDomain.rem = rem;
}

var eppCommander = new EppCommander(registry);
eppCommander.updateDomain(updateDomain).then(function(data) {
    console.log("Updated domain ", domain);
    return;
}).fail(function(error) {
    console.error("Unable to update domain: ", error);
}).fin(function() {
    process.exit(0);
});

