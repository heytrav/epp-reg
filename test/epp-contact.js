nconf = require('nconf');
var fs = require('fs');
var chai = require('chai');
var moment = require('moment');

var expect = chai.expect,
should = chai.should;

var EppCommander = require('../lib/epp-commander.js');


describe("Contact creation", function() {
    var eppCommander;
	before(function() {
        eppCommander = new EppCommander('hexonet-test1');
	});
    var processResult = function(data) {
        if (data.result && data.result.code) {
            var code = data.result.code;
            if (code >= 2000) {
                throw data;//new Error("EPP Exception");
            }
        }
        return data;
    };
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

		eppCommander.createContact(contactData).then(function (successfulResult) {
            return processResult(successfulResult);
        }).then(function(data){
			try {
				expect(data).to.have.deep.property('result');
				done();
			} catch(e) {
				done(e);
			}}, function (error) {
                console.error("This shouldn't happen");
            });

	});

    it('should get a failed create contact error', function(done) {
		var contactId = ['iwmn', moment().unix()].join('-');
        
		var contactData = {
			"id": 'auto', // bogus id
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

		eppCommander.createContact(contactData).then(function(data) {
            return processResult(data);
		}).then(function (data) {
            console.log("Successful result shouldn't happen");
        }, function (error) {
			try {
				expect(error).to.have.deep.property('result');
                expect(error.result.code).to.be.gt(2000);
				done();
			} catch(e) {
				done(e);
			}
        });
    });
});

