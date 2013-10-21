restify = require('restify');
expect = require('expect.js');

before(function(done) {
    require('../start_server').StartServer();
    done();
});