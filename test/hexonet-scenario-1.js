nconf = require('nconf');
var fs = require('fs');
var chai = require('chai');
var moment = require('moment');

var expect = chai.expect,
should = chai.should;

var EppCommander = require('../lib/epp-commander.js');
describe('Hexonet scenarios', function() {
	var eppCommander;
	var registrant, tech, admin, billing;
	var registrantId;
	var techId = 'hex1-tech',
	billingId = 'hex1-billing',
	adminId = 'hex1-admin';

	beforeEach(function() {
		eppCommander = new EppCommander('hexonet-test1');
	});
	it('should check for and then create a regular contact', function(done) {
		this.timeout(10000);
		registrantId = ['iwmn', moment().unix()].join('-');
		var contactData = {
			"id": registrantId,
			"voice": "+1.9405551234",
			"fax": "+1.9405551233",
			"email": "test+homer@ideegeo.com",
			"authInfo": {
				"pw": "xyz123"
			},
			"postalInfo": [{
				"name": "Homer Simpson",
				"org": "Nucular Power Plant",
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
		eppCommander.checkContact({
			"id": registrantId
		}).then(function(data) {
			try {
				expect(data).to.have.deep.property('data.contact:chkData.contact:cd.contact:id.avail', 1);
			} catch(e) {
				throw e;
			}
		}).then(function(data) {
			// Create the contact if the check contact was successful.
			eppCommander.createContact(contactData).then(
			function(data) {
				try {
					expect(data).to.have.deep.property('result.code', 1000);
					done();
				} catch(e) {
					done(e);
				}
			});
		},
		function(error) {
			done(error);
		});
	});
	it('should create if billing contact exists', function(done) {
		this.timeout(10000);
		billingId = 'iwmn-hex1-billing';
		var contactData = {
			"id": billingId
		};
		eppCommander.checkContact({
			"id": billingId
		}).then(function(data) {
			try {
				expect(data).to.have.deep.property('data.contact:chkData.contact:cd.contact:id.avail', 0);
				done();
			} catch(e) {
				done(e);
			}
		});
	});
	it('should check if tech contact exists', function(done) {
		this.timeout(10000);
		techId = 'iwmn-hex1-tech';
		var contactData = {
			"id": techId,
		};
		eppCommander.checkContact({
			"id": techId
		}).then(function(data) {
			try {
				expect(data).to.have.deep.property('data.contact:chkData.contact:cd.contact:id.avail', 0);
				done();
			} catch(e) {
				done(e);
			}
		});
	});
	it('should create a admin contact', function(done) {
		this.timeout(10000);
		adminId = 'iwmn-hex1-admin';
		var contactData = {
			"id": adminId,
		};
		eppCommander.checkContact({
			"id": adminId
		}).then(function(data) {
			try {
				expect(data).to.have.deep.property('data.contact:chkData.contact:cd.contact:id.avail', 0);
				done();
			} catch(e) {
				done(e);
			}
		});
	});
	it('should create a domain with contacts', function(done) {
        this.timeout(10000);
		var domain = ['iwmn', moment().unix(), 'test.com'].join('-');
        eppCommander.checkDomain({"domain": domain}).then(function(data) {
            var createDomain = {
                "name": domain,
                "period": {
                    "unit": "y",
                    "value": 1
                },
                "ns": ["ns1.hexonet.net", "ns2.hexonet.net"],
                "registrant":registrantId,
                "contact": [
                    { "admin": adminId },
                    { "tech": techId },
                    { "billing": billingId }
                ],
                "authInfo": {
                    "pw": "Axri3k.XXjp"
                }
            };
            eppCommander.createDomain(createDomain).then(function(data){
                try {
                    expect(data).to.have.deep.property('result.code', 1000);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
	});
});

