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
        this.timeout(10000);
        var pollData = {
            "op": "req"
        };
        eppCommander.poll(pollData).then(
        function(data) {
            console.log("Poll returned: ", data);
            if (data.hasOwnProperty('data')) {
                var pollData = data.data;
                if (pollData.hasOwnProperty('domain:infData')) {
                   var infoData = pollData['domain:infData']; 
                   var authInfo = infoData["domain:authInfo"];
                   console.log("Auth info: ", authInfo);
                }
            }
            try {
                expect(data).to.have.deep.property('result.code');
                expect(data.result.code).to.be.within(1300, 1399);
                if (data.hasOwnProperty('msgQ')) {
                    msgId = data.msgQ.id;
                }
                done();
            } catch(e) {
                done(e);
            }
        },
        function(error) {
            done(error);
        });

    });
    it('should ack a message', function(done) {
        this.timeout(10000);
        if (msgId !== undefined) {
            eppCommander.poll({
                "op": "ack",
                "msgID": msgId
            }).then(
            function(data) {
                console.log("Poll ack returned: ", data);
                try {
                    expect(data.result.code).to.be.within(1000, 2000);
                    done();
                } catch(e) {
                    done(e);
                }
            },
            function(error) {
                done(error);
            });
        } else {
            // there was no msgId in previous poll req
            done();
        }
    });
});

