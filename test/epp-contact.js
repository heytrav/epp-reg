nconf = require('nconf');
nconf.env().file({
	"file": "./config/epp-reg-devel.json"
});
var fs = require('fs');
var chai = require('chai');
var moment = require('moment');
var AMQP = require('amqp-as-promised');

var expect = chai.expect,
should = chai.should;

var rabbitmqConfig = nconf.get('rabbitmq');

describe("Contact creation", function() {
	var amqpConnection;
	before(function() {
		amqpConnection = new AMQP(rabbitmqConfig.connection);
	});
	it('should create a contact', function(done) {
		var contactId = ['iwmn', moment().unix()].join('-');

		var contactData = {
			"id": contactId,
			"voice": "+1.9405551234",
			"fax": "+1.9405551233",
			"email": "john.doe@null.com",
			"authInfo": {
				"pw": "xyz123"
			},
			"postalInfo": [{
				"name": "John Doe",
				"org": "Example Ltd",
				"type": "int",
				"addr": [{
					"street": ["742 Evergreen Terrace", "Apt b"],
					"city": "Springfield",
					"sp": "OR",
					"pc": "97801",
					"cc": "US"
				}]
			}]
		};
		var createContact = {
			"command": "createContact",
			"data": contactData
		};

		amqpConnection.rpc('epp', 'eppServer.hexonet-test1', createContact, null, {
			"timeout": 4000
		}).then(function(data) {
			try {
				expect(data).to.have.deep.property('result');
				done();
			} catch(e) {
				done(e);
			}
		});

	});

});

