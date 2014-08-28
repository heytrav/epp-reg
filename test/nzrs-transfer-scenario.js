var chai = require('chai');
var moment = require('moment');

var expect = chai.expect,
should = chai.should;

var EppCommander = require('../lib/epp-commander.js');
describe.skip('NZRS domain transfer', function () {
    var domain = 'iwmn1408920941test.co.nz';
    var authInfo = '79z4wBm7';
    describe('get domain info', function () {
        var eppCommander;
        before(function() {
            eppCommander = new EppCommander('nzrs-test1');
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
            eppCommander = new EppCommander('nzrs-test2');
        });
        it.skip('should request a domain transfer', function() {
            
        });
    });

});
