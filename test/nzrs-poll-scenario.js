nconf = require('nconf');
var fs = require('fs');
var chai = require('chai');
var moment = require('moment');

var expect = chai.expect,
should = chai.should;

var EppCommander = require('../lib/epp-commander.js');
describe('NZRS poll', function() {
    var eppCommander;
    var msgId;
    before(function() {
        eppCommander = new EppCommander('nzrs-test1');
    });
    it('should execute a poll', function(done) {
        var pollData = {
            "op": "req"
        };
        eppCommander.poll(pollData).then(
        function(data) {
            console.log("Poll returned: ", data);
            try {
                expect(data).to.have.deep.property('result.code');
                expect(data.result.code).to.be.lt(2000);
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

