var chai = require('chai');
var moment = require('moment');

var expect = chai.expect,
should = chai.should;

describe.skip('NZRS domain transfer', function () {
    var EppCommander = require('../lib/epp-commander.js');
    var domain = 'iwmn1408920941test.tld';
    var authInfo = '79z4wBm7';
    describe('get domain info', function () {
        var eppCommander;
        before(function() {
            eppCommander = new EppCommander('registry-test1');
        });
        it('should get info for a domain', function(done) {
            eppCommander.infoDomain({"domain": domain, "authInfo": authInfo}).then(
                function(data) {
                    try {
                        expect(data).to.have.deep.property("data");
                        console.log("Domain data: ", data.data);
                        done();
                    } catch (e) {
                        done(e);
                    }
                }, 
                function(error) {
                    done(error);
                });
        });

    });
    describe.skip('as foreign registrar', function() {
        var eppCommander;
        before(function() {
            eppCommander = new EppCommander('registry-test2');
        });
        it.skip('should request a domain transfer', function() {
            
        });
    });
});
