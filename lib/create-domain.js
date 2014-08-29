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
    var object = {"host": host};
    if (hostObj.length) {
        object.addr = hostObj;
    }
    nsObjects.push(object);
}
function collectAdmins(val, adminContacts) {
    adminContacts.push(val);
    return adminContacts;
}
function collectTechs(val, techContacts) {
    techContacts.push(val);
    return techContacts;
}
function collectBillings(val, billingContacts) {
    billingContacts.push(val);
    return billingContacts;
}

program.version('0.0.1').usage('[options]')
.option('-d, --domain <domain>', 'Domain name' )
.option('-t, --tech [tech]', 'Tech contact', collectTechs, [])
.option('-a, --admin [admin]', 'Admin contact', collectAdmins, [] )
.option('-b, --billing [billing]', 'Billing contact', collectBillings, [])
.option('-n, --nameserver [nameserver]')
.option('-o, --nsobj <nameserver object>', 'Nameserver object: ns1.host.com;23.44.22.44;67.24.55.22', collectNsObjects, [])
.option('-r, --registrant [registrant]', 'Registrant')
.option('-x, --authinfo [authInfo]' );

program.parse(process.argv);
