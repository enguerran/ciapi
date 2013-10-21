// init the test client
var client = restify.createJsonClient({
    version: '*',
    url: 'http://127.0.0.1:8080'
});

describe('test rest api service: initiatives', function() {
    var id;

    describe('POST /initiatives', function() {
        it('should returns the created initiatives', function(done) {
            client.post('/initiatives', { name: 'Fabindia', gps: [13.032724,77.569691] }, function(e, req, res, data) {
                expect(e).to.eql(null);
                expect(data.length).to.eql(1);
                expect(data[0]._id.length).to.eql(24);
                id = data[0]._id;
                done();
            });
        });
    });

    describe('GET /initiatives/:id', function() {
        it('should retrieve an object', function(done) {
            client.get('/initiatives/' + id, function(e, req, res, data) {
                expect(e).to.eql(null);
                expect(typeof data).to.eql('object');
                expect(data._id.length).to.eql(24);
                expect(data._id).to.eql(id);
                done();
            });
        });
    });

    describe('GET /initiatives', function() {
        it('should retrieve a collection', function(done) {
            client.get('/initiatives', function(e, req, res, data) {
                expect(e).to.eql(null);
                expect(data.length).to.be.above(0);
                expect(data.map(function (item) { return item._id })).to.contain(id);
                done();
            });
        });
    });

    describe('PUT /initiatives/:id', function() {
        it('should update an object', function(done) {
            client.put('/initiatives/' + id, { name: 'Fabindia New BEL Road' }, function(e, req, res, data) {
                expect(e).to.eql(null);
                expect(typeof data).to.eql('object');
                expect(data.msg).to.eql('success');
                done();
            });
        });
    });

    describe('GET /initiatives/:id', function() {
        it('should check the updated object', function(done) {
            client.get('/initiatives/' + id, function(e, req, res, data) {
                expect(e).to.eql(null);
                expect(typeof data).to.eql('object');
                expect(data._id.length).to.eql(24);
                expect(data._id).to.eql(id);
                expect(data.name).to.eql("Fabindia New BEL Road");
                done();
            });
        });
    });

    describe('DELETE /initiatives/:id', function() {
        it('should remove a object', function(done) {
            client.del('/initiatives/' + id, function(e, req, res, data) {
                expect(e).to.eql(null);
                expect(typeof data).to.eql('object');
                expect(data.msg).to.eql('success');
                done();
            });
        });
    });
});

describe('test rest api service: find', function() {
    var id;

    describe('POST /initiatives', function() {
        it('should returns the created initiatives', function(done) {
            client.post('/initiatives', { name: 'Fabindia', gps: [13.032724,77.569691] }, function(e, req, res, data) {
                expect(e).to.eql(null);
                expect(data.length).to.eql(1);
                expect(data[0]._id.length).to.eql(24);
                id = data[0]._id;
                done();
            });
        });
    });

    describe('GET /find', function() {
        it('should return collection', function(done) {
            client.get('/find?gps=13.03,77.56', function(e, req, res, data) {
                expect(e).to.eql(null);
                expect(data.length).to.eql(1);
                expect(data[0]._id).to.eql(id);
                done();
            });
        });
    });

    describe('DELETE /initiatives/:id', function() {
        it('should remove a object', function(done) {
            client.del('/initiatives/' + id, function(e, req, res, data) {
                expect(e).to.eql(null);
                expect(typeof data).to.eql('object');
                expect(data.msg).to.eql('success');
                done();
            });
        });
    });
});