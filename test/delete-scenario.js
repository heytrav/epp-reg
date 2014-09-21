var nconf = require('nconf');
var chai = require('chai');
var moment = require('moment');

var expect = chai.expect,
should = chai.should;

var EppCommander = require('../lib/epp-commander.js');
describe('NZRS delete scenario', function() {
    var domain = ['iwmn', moment().unix(), 'test.tld'].join('-');
    describe.skip('create a domain, then delete it', function() {
        var eppCommander;
        var registrant, tech, admin, billing;
        var registrantId, updateRegistrantId;
        var techId = 'registry1tech',
        billingId = 'registry1billing',
        updateTechId = 'registry1tech2',
        adminId = 'registry1admin';

        beforeEach(function() {
            eppCommander = new EppCommander('registry-test1');
        });
        it('should check for and then create a regular contact', function(done) {
            this.timeout(10000);
            registrantId = ['iwmn', moment().unix()].join('');
            // Note!! "org" field not supported!
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
            },
            function(error) {
                // catch error that may come out of check.
                done(error);
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
                },
                function(error) {
                    done(error);
                });
            },
            function(error) {
                done(error);
            });
        });
        it('should check if tech contact exists', function(done) {
            this.timeout(10000);
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
        it('should check if admin contact exists', function(done) {
            this.timeout(10000);
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
            eppCommander.checkDomain({
                "domain": domain
            }).then(function(data) {
                var createDomain = {
                    "name": domain,
                    "period": {
                        "unit": "y",
                        "value": 1
                    },
                    "ns": [{
                        "host": "ns1.hexonet.net"
                    },
                    {
                        "host": "ns2.hexonet.net"
                    }],
                    "registrant": registrantId,
                    "contact": [{
                        "admin": adminId
                    },
                    {
                        "tech": techId
                    },
                    ],
                    "authInfo": {
                        "pw": "Axri3k.XXjp"
                    }
                };
                eppCommander.createDomain(createDomain).then(function(data) {
                    try {
                        console.log("Created domain: " + domain);
                        expect(data).to.have.deep.property('result.code', 1000);
                        done();
                    } catch(e) {
                        done(e);
                    }
                },
                function(error) {
                    // cover possible error case
                    done(error);
                });
            });
        });
        it('should delete domain', function(done) {
            var deleteData = {
                "domain": domain
            };
            eppCommander.deleteDomain(deleteData).then(function(data) {
                try {
                    expect(data).to.have.deep.property('result.code', 1000);
                    done();

                } catch(e) {
                    done(e);
                }
            },
            function(error) {
                done(error);
            });

        });
    });
});

