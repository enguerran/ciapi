describe('test data: initiatives', function() {
    var originalName = 'Test1';
    var originalLatitude = 13.032724;
    var originalLongitude = 77.569691;
    
    var id;
    var client;

    before(function() {
        // init the test client
        client = restify.createJsonClient({
            version: '*',
            url: 'http://127.0.0.1:8080',
            headers: {
                'authorization': "Access-Token 8823bcf0dfc6ba33e87ef92a39a29960cec1577f306b8efd827b62edceeb8f0d926f2e8259f5d1237d22ca9527b4f53836ba57a68ff0a14cf88b6ceef7931cd454bac298a5dcc098cf632e7ed42e220b40a73aabcfe2ef5ee20b81d828c7b6b59a4afd9cfbb34c320f50e9bb3804db1f71bfea2e2c7e335d0e78686c0f219cb12482f163e7a7deae0603fc6a853bd52f256f3e4988b82df3be63d4e6f78a66fd72219fc5a13114102b6940069f8c05e2"
            }
        });
    });


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
