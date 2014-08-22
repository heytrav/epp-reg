
nconf = require('nconf');
nconf.env().file({
    "file": "./config/epp-reg.json"
});
var fs = require('fs');
var chai = require('chai');
var moment = require('moment');

var expect = chai.expect,
should = chai.should;
