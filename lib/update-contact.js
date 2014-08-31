var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');

function collectStreets(val, streetParts) {
    streetParts.push(val);
    return streetParts;
}

program.version('0.0.1').usage('[options]').option('-r, --registry <registry>', 'Registry', '', 'test').option('-n, --name <name>', 'Name', '').option('-i, --id <id>', 'id', ['iwmn', moment().unix()].join('')).option('-f, --fax <fax>', 'Fax', '').option('-e, --email <email>', 'Email', '').option('-a, --authinfo <auth info>', 'AuthInfo', '').option('-s, --street [street]', 'Street', collectStreets, []).option('-c, --city <city>', 'City').option('-t, --state <state>', 'State/Province').option('-o, --country <country>', 'Country').option('-p, --telephone <telephone>').option('-y, --type', 'Type', 'int').option('-l, --postcode <postcode>', 'Postcode');
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
var type = program.type || 'int';
var id = program.id;

var updateData = {
	"id": id,
	"chg": {
		"voice": telephone,
		"fax": fax,
		"email": email,
		"authInfo": auth,
		"postalInfo": {
			"type": type,
			"name": name,
			"addr": {
				"street": street,
				"city": city,
				"sp": state,
				"cc": country,
				"pc": postcode,
			}
		}
	}
};

var eppCommander = new EppCommander(registry);
eppCommander.updateContact(updateData).then(function(data){
    console.log("Updated contact: ",data);
}).fail(function(error) {
    console.error("Unable to update contact: ", error);
}).fin(function() {
    process.exit(0);
});
