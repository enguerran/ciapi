exports.StartServer = function() {

    var restify = require('restify');
    var mongoose = require('mongoose');
    var configmongodb = require('./config');
    
    var db = mongoose.connect(configmongodb.creds.mongoose_auth_local);
    var Schema = mongoose.Schema;
    var InitiativesSchema = new Schema({
        name: { type: String, unique: true }
    });
    mongoose.model('Initiatives', InitiativesSchema);
    var Initiatives = mongoose.model('Initiatives');

    function createNewInitiative(req, res, next) {
        if (req.params.name === undefined) {
            return next(new restify.InvalidArgumentError('Name must be supplied'));
        }
        else {
            var initiatives = new Initiatives();
            initiatives.name = req.params.name;
            initiatives.save(function(err, data) {
                if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err.errors)));
                res.contentType = 'application/json';
                res.send([data]);
            });
        }

    }

    function getInitiative(req, res, next) {
        if(req.params.id === undefined) {
            return next(new restify.InvalidArgumentError('ID must be supplied'));
        }
        else {
            Initiatives.findById(req.params.id, function(err, initiative) {
                res.send(initiative);
            })
        }
    }

    function getInitiatives(req, res, next) {
        Initiatives.find(function(err, initiatives) {
                res.send(initiatives);
        });
    }

    function updateInitiative(req, res, next) {
        if(req.params.id === undefined || req.params.name === undefined) {
            return next(new restify.InvalidArgumentError('ID and name must be supplied'));
        }
        else {
            Initiatives.update({ _id: req.params.id }, { name: req.params.name }, { multi: false }, function(err, count, raw) {
                if(err) {
                    throw err;
                }
                else {
                    res.send((count===1)?{ msg: 'success' }:{ msg: 'error'});
                }
            });
        }
    }

    function deleteInitiative(req, res, next) {
        if(req.params.id === undefined) {
            return next(new restify.InvalidArgumentError('ID must be supplied'));
        }
        else {
            Initiatives.remove({ _id: req.params.id }, function(err, count) {
                if(err) {
                    throw err;
                }
                else {
                    res.send((count===1)?{ msg: 'success' }:{ msg: 'error'});
                }
            });
        }
    }

    var server = restify.createServer();
    server.use(restify.fullResponse());
    server.use(restify.bodyParser());
    server.post('/initiatives', createNewInitiative);
    server.get('/initiatives/:id', getInitiative);
    server.get('/initiatives', getInitiatives);
    server.put('/initiatives/:id', updateInitiative);
    server.del('/initiatives/:id', deleteInitiative);

    server.listen(8080, function() {
        console.log('%s listening at %s', server.name, server.url);
    });

};