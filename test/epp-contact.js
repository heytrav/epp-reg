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
        eppCommander = new EppCommander('registry-test2');
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

        eppCommander.createContact(contactData).then(function(data) {
            console.log("successful contact creation: ", data);
            try {
                expect(data).to.have.deep.property('result');
                done();
            } catch(e) {
                done(e);
            }
        },
        function(error) {
            try { // force test to fail if this executes
                expect(true).to.equal(false);
                done();

            } catch(e) {
                done(e);
            }
        });
    });

    it('should get a failed create contact error', function(done) {
        var contactId = ['iwmn', moment().unix()].join('-');

        var contactData = {
            // bogus id that already exists. We just want the registry to
            // throw an error
            "id": 'auto',
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
            console.log("Successful result shouldn't happen");
            try { // force test to fail if this executes
                expect(true).to.equal(false);
                done();
            } catch(e) {
                done(e);
            }
        },
        function(error) {
            console.log("Error received: ", error);
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

