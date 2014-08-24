var nconf = require('nconf');
nconf.env().file({
	"file": "./config/epp-reg.json"
});
var moment = require('moment');
var AMQP = require('amqp-as-promised');
var rabbitmqConfig = nconf.get('rabbitmq');

var commands = ["poll", "checkContact", "infoContact", "createContact", "updateContact", "deleteContact", "transferContact", "checkDomain", "infoDomain", "createDomain", "updateDomain", "deleteDomain", "renewDomain", "transferDomain", "checkHost", "infoHost", "createHost", "updateHost", "deleteHost", "renewHost", "transferHost"];

var amqpConnection = new AMQP(rabbitmqConfig.connection);
var registry;
function EppCommander(reg) {
	registry = reg;
}

/*
 * This looks at the EPP datastructure that was received from the registry and
 * checks the result.code error value. Values over 2000 are considered
 * errors.
 */
var processEppResult = function(data){
        if (data.result && data.result.code) {
            var code = data.result.code;
            if (code >= 2000) 
                throw data; //new Error("EPP Exception");
        }
        return data;
};

/*
 * Wrapper that sends commands with data structure to EPP server queue. Do not call this directly!
 * Call createDomain, checkDomain, etc. instead.
 * */

EppCommander.prototype.sendCommand = function(command, data) {
    var topic = ['eppServer', registry].join('.');
    var commandData = {
        "command": command,
        "data": data
    };
    return amqpConnection.rpc('epp', topic, commandData, null, {"timeout": 20000}).then(
            processEppResult, function(error) { throw error; });
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

