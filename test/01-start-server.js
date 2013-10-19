restify = require('restify');
assert = require('assert');

before(function(done) {
    require('../start_server').StartServer();
    done();
});