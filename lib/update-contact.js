var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');

function collectStreets(val, streetParts) {
    streetParts.push(val);
    return streetParts;
}

program.version('0.0.1').usage('[options]').option('-r, --registry <registry>', 'Registry', '', 'test').option('-n, --name <name>', 'Name', '').option('-i, --id <id>', 'id', ['iwmn', moment().unix()].join('')).option('-f, --fax <fax>', 'Fax', '').option('-e, --email <email>', 'Email', '').option('-a, --authinfo <auth info>', 'AuthInfo', '').option('-s, --street [street]', 'Street', collectStreets, []).option('-c, --city <city>', 'City').option('-t, --state <state>', 'State/Province').option('-o, --country <country>', 'Country').option('-p, --telephone <telephone>').option('-l, --postcode <postcode>', 'Postcode').option('--company <company name>', 'Company name');
program.parse(process.argv);

var registry = program.registry;
var name = program.name;
var telephone = program.telephone;
var street = program.street;
var city = program.city;
var country = program.country;
var state = program.state;
var fax = program.fax;
var postcode = program.postcode;
var email = program.email;
var auth = program.authinfo;
var state = program.state;
var org = program.company;
var id = program.id;
var addrData = {
    "street": street,
    "city": city,
    "sp": state,
    "cc": country,
    "pc": postcode,
};

var postalInfo = {
    "addr": addrData
};
if (name) postalInfo.name = name;
if (org) postalInfo.org = org;
var chg = {
    "postalInfo": postalInfo
};
if (telephone) chg.voice = telephone;
if (fax) chg.fax = fax;
if (email) chg.email = email;
if (auth) chg.authInfo = auth;

var updateData = {
    "id": id,
    "chg": chg
};

var eppCommander = new EppCommander(registry);
eppCommander.updateContact(updateData).then(function(data) {
    console.log("Updated contact: ", data);
}).fail(function(error) {
    console.error("Unable to update contact: ", error);
}).fin(function() {
    process.exit(0);
});

