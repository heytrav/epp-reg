var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');


program.version('0.0.1').usage('[options]')
.option('-r, --registry <registry>', 'Registry')
.option('-i, --id <contact>', 'Registry contact id');

program.parse(process.argv);
var contactId = program.id;
var registry = program.registry;

var infoContact = {"id": contactId};
var eppCommander = new EppCommander(registry);
eppCommander.infoContact(infoContact).then(function(data){
    var contactData  = data.data;
    if (contactData.hasOwnProperty('contact:infData')) {
        var infoData = contactData["contact:infData"];
        console.log(infoData);
    }
}).fail(function(error){
    console.error("Unable to fetch contact data: ",error);
}).fin(function(){
    process.exit(0);
});

