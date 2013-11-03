// init the test client
var client = restify.createJsonClient({
    version: '*',
    url: 'http://127.0.0.1:8080'
});

describe('test data: initiatives', function() {
    var originalName = 'Test1';
    var originalLatitude = 13.032724;
    var originalLongitude = 77.569691;
    
    var id;

    var newInitiative ={
        name: originalName,
        geocode: [originalLatitude,originalLongitude],
        contact: {
            address: {
                pin: "560032",
            },
            email: [],
            phone: [],
        },
        tags: [],
    };

    describe('POST /v1/initiatives', function() {
        it('should record all data', function(done) {
            client.post('/v1/initiatives', newInitiative, function(e, req, res, data) {
                expect(e).to.eql(null);
                expect(data.length).to.eql(1);
                expect(data[0]._id.length).to.eql(24);

                id = data[0]._id;
                
                for(prop in newInitiative) {
                    expect(data[0][prop]).to.eql(newInitiative[prop]);
                }

                done();
            });
        });
    });

    describe('DELETE /v1/initiatives/:id', function() {
        it('should remove a object', function(done) {
            client.del('/v1/initiatives/' + id, function(e, req, res, data) {
                expect(e).to.eql(null);
                expect(typeof data).to.eql('object');
                expect(data.msg).to.eql('success');
                done();
            });
        });
    });
});
