var EppCommander = require('../lib/epp-commander.js');
var moment = require('moment');
var program = require('commander');

program.version('0.0.1').usage('[options]').option('-r, --registry <registry>', 'Registry').option('-i, --msgid <msgid>', 'Message ID to acknowledge');

program.parse(process.argv);

var registry = program.registry;
var msgId = program.msgid;

var op = "req";
var poll = {
	"op": op
};
if (msgId) {
	poll.op = "ack";
	poll.msgID = msgId;
}

var eppCommander = new EppCommander(registry);
eppCommander.poll(poll).then(function(data) {
	if (data.hasOwnProperty('msgQ')) {
		var msgQ = data.msgQ;
		console.log("%d more messages", msgQ.count);
		console.log("next message id: ", msgQ.id);
		console.log(msgQ.msg.$t);
	}
	if (data.hasOwnPropery('data')) {
		var pollData = data.data;
		if (pollData.hasOwnProperty('domain:infData')) {
			var infoData = pollData["domain:infData"];
			console.log("Received data: ", infoData);
		}
	}
}).fail(function(error) {
	console.error("Problem polling registry: ", error);
}).fin(function() {
	process.exit(0);
});

