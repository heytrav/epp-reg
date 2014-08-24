nconf = require('nconf');
var fs = require('fs');
var chai = require('chai');
var moment = require('moment');

var expect = chai.expect,
should = chai.should;

var EppCommander = require('../lib/epp-commander.js');
describe('NZRS scenarios', function() {
    var domain = ['iwmn', moment().unix(), 'test.co.nz'].join('');
    describe('domain operations accreditation 1', function() {
        var eppCommander;
        var registrant, tech, admin, billing;
        var registrantId, updateRegistrantId;
        var techId = 'nzrs1tech',
        billingId = 'nzrs1billing',
        updateTechId = 'nzrs1tech2',
        adminId = 'nzrs1admin';

        beforeEach(function() {
            eppCommander = new EppCommander('nzrs-test1');
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
        it.skip('should check for and then create a tech contact', function(done) {
            this.timeout(10000);
            var contactData = {
                "id": techId,
                "voice": "+1.9405551234",
                "fax": "+1.9405551233",
                "email": "test+tech@ideegeo.com",
                "authInfo": {
                    "pw": "xyz123"
                },
                "postalInfo": [{
                    "name": "Tech Guy",
                    "org": "",
                    "type": "int",
                    "addr": [{
                        "street": ["167 Vivian St.", "Apt b"],
                        "city": "Wellington",
                        "sp": "Wellington",
                        "pc": "6011",
                        "cc": "NZ"
                    }]
                }]
            };
            eppCommander.checkContact({
                "id": techId
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
        it.skip('should check for and then create a admin contact', function(done) {
            this.timeout(10000);
            var contactData = {
                "id": adminId,
                "voice": "+1.9405551234",
                "fax": "+1.9405551233",
                "email": "test+admin@ideegeo.com",
                "authInfo": {
                    "pw": "xyz123"
                },
                "postalInfo": [{
                    "name": "Admin Guy",
                    "org": "",
                    "type": "int",
                    "addr": [{
                        "street": ["167 Vivian St.", "Apt b"],
                        "city": "Wellington",
                        "sp": "Wellington",
                        "pc": "6011",
                        "cc": "NZ"
                    }]
                }]
            };
            eppCommander.checkContact({
                "id": adminId
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
        it('should check for and then create a different contact', function(done) {
            this.timeout(10000);
            updateRegistrantId = ['iwmn', moment().unix()].join('-');
            var contactData = {
                "id": updateRegistrantId,
                "voice": "+1.9405551234",
                "fax": "+1.9405551233",
                "email": "test+marge@ideegeo.com",
                "authInfo": {
                    "pw": "xyz123"
                },
                "postalInfo": [{
                    "name": "Marge Simpson",
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
                "id": updateRegistrantId
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
        it.skip('should check for and then create a new tech contact', function(done) {
            this.timeout(10000);
            var contactData = {
                "id": updateTechId,
                "voice": "+1.9405551234",
                "fax": "+1.9405551233",
                "email": "test+billing@ideegeo.com",
                "authInfo": {
                    "pw": "xyz123"
                },
                "postalInfo": [{
                    "name": "Billing Guy",
                    "org": "",
                    "type": "int",
                    "addr": [{
                        "street": ["167 Vivian St.", "Apt b"],
                        "city": "Wellington",
                        "sp": "Wellington",
                        "pc": "6011",
                        "cc": "NZ"
                    }]
                }]
            };
            eppCommander.checkContact({
                "id": updateTechId
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
        it('should check if second tech contact exists', function(done) {
            this.timeout(10000);
            var contactData = {
                "id": updateTechId
            };
            eppCommander.checkContact(contactData).then(function(data) {
                try {
                    expect(data).to.have.deep.property('data.contact:chkData.contact:cd.contact:id.avail', 0);
                    done();
                } catch(e) {
                    done(e);
                }
            });
        });
        it('should update the domain with new ns and contact', function(done) {
            this.timeout(40000);
            var updateData = {
                "name": domain,
                "chg": {
                    "registrant": updateRegistrantId
                },
                "rem": {
                    "contact": [{
                        "tech": techId
                    }],
                    "ns": [{
                        "host": "ns2.hexonet.net"
                    }]
                },
                "add": {
                    "contact": [{
                        "tech": updateTechId
                    }],
                    "ns": [{
                        "host": "ns3.hexonet.net"
                    }]
                }
            };
            eppCommander.updateDomain(updateData).then(function(data) {
                try {
                    console.log("Update result: ", data);
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
        it('should do an info domain', function(done) {
            this.timeout(40000);
            var infoDomain = {
                "name": domain
            };
            eppCommander.infoDomain(infoDomain).then(function(data) {
                try {
                    console.log("info result: ", data);
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
    describe('domain operations accreditation 2', function(){
        var eppCommander2;
        beforeEach(function(){
            eppCommander2 = new EppCommander('nzrs-test2');
        });
        it('should initiate a domain transfer', function(done) {
            var transferData = {
                "op": "request",
                "authInfo": "Axri3k.XXjp",
                "domain": domain
            };

            eppCommander2.transferDomain(transferData).then(
                function(data){
                    done(new Error('Should not execute'));
                }, function(error){
                    try {
                        expect(error).to.have.deep.property('result.code');
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    } );
});

