var nconf = require('nconf');
nconf.env().file({
	"file": "./config/epp-reg-devel.json"
});
var moment = require('moment');
var AMQP = require('amqp-as-promised');
var rabbitmqConfig = nconf.get('rabbitmq');

var commands = ["checkContact", "infoContact", "createContact", "updateContact", "deleteContact", "transferContact", "checkDomain", "infoDomain", "createDomain", "updateDomain", "deleteDomain", "renewDomain", "transferDomain", "checkHost", "infoHost", "createHost", "updateHost", "deleteHost", "renewHost", "transferHost"];

var amqpConnection = new AMQP(rabbitmqConfig.connection);
var registry;
function EppCommander(reg) {
	registry = reg;
}

EppCommander.prototype.sendCommand = function(command, data) {
    var topic = ['eppServer', registry].join('.');
    var commandData = {
        "command": command,
        "data": data
    };
    return amqpConnection.rpc('epp', topic, commandData, null, {"timeout": 4000});
};

EppCommander.createCommand = function (command) {
    EppCommander.prototype[command] = function(data) {
        return EppCommander.prototype.sendCommand(command, data);
    };
};
for (var i in commands) {
    var command = commands[i];
    EppCommander.createCommand(command);
}


module.exports = EppCommander;

