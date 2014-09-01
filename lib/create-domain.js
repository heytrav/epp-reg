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
        object.addr = [];
        hostObj.forEach(function(item) {
            var ipType = item.split('=');
            var ip = ipType.shift();
            var type = 'v4';
            if (ipType.length) type = ipType.shift();
            var attrObj = {
                "type": type,
                "ip": ip
            };
            object.addr.push(attrObj);
        });
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

var contacts = [];
var nameservers = [];

program.version('0.0.1').usage('[options]').option('-d, --name <domain>', 'Domain name').option('-t, --tech [tech]', 'Tech contact', collectTechs, contacts).option('-a, --admin [admin]', 'Admin contact', collectAdmins, contacts).option('-b, --billing [billing]', 'Billing contact', collectBillings, contacts).option('-n, --nameserver [nameserver]', 'Nameservers', collectNameservers, nameservers).option('--nsobj [nameserver object]', 'Nameserver object: ns1.host.com;23.44.22.44;67.24.55.22', collectNsObjects, nameservers).option('-o, --registrant <registrant>', 'Registrant').option('-r, --registry <registry>').option('-p, --period <int>', 'Registration period', 1).option('-u, --unit <unit>', 'Registration period unit', 'y').option('--authinfo [authInfo]', 'AuthInfo', '');

program.parse(process.argv);

var registry = program.registry;
var domain = program.name;
var registrant = program.registrant;
var authInfo = program.authinfo;
var period = program.period;
var unit = program.unit;

var createDomain = {
    "name": domain,
    "period": {
        "unit": unit,
        "value": period
    },
    "registrant": registrant,
    "ns": nameservers,
    "contact": contacts,
    "authInfo": authInfo,
};

var eppCommander = new EppCommander(registry);
eppCommander.checkDomain({
    "name": domain
}).then(function(data) {
    var isAvailable = data.data['domain:chkData']['domain:cd']['domain:name'].avail;
    if (!isAvailable) {
        throw new Error("Domain is not available");
    } else {
        return createDomain;
    }
})
.then(function(data) {
    return eppCommander.createDomain(data);
})
.then(function(data) {
    console.log("Created domain: ", domain);
    console.log("Expires: ", data.data["domain:creData"]["domain:exDate"]);
}).fail(function(error) {
    console.error("Unable to register domain: ", error);
}).fin(function(){
    process.exit(0);
});

