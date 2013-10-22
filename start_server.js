exports.StartServer = function() {

    var restify = require('restify');
    var mongoose = require('mongoose');
    var configmongodb = require('./config');
    
    var db = mongoose.connect(configmongodb.creds.mongoose_auth_local);
    var Schema = mongoose.Schema;
    var InitiativesSchema = new Schema({
        name: { type: String, unique: true },
        pin: { type: Number },
        city: { type: String },
        gps: { type: [Number], index: '2d' }
    });
    mongoose.model('Initiatives', InitiativesSchema);
    var Initiatives = mongoose.model('Initiatives');

    function createNewInitiative(req, res, next) {
        if (req.params.name === undefined) {
            return next(new restify.InvalidArgumentError('Name must be supplied'));
        }
        else {
            if(typeof req.params.gps === 'string') {
                if(req.params.gps != '') req.params.gps = req.params.gps.split(',');
                else req.params.gps = [];
            }
            var initiatives = new Initiatives(req.params);
            initiatives.save(function(err, data) {
                if (err) return next(new restify.InvalidArgumentError(JSON.stringify(err.err)));
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
        if(req.params.id === undefined) {
            return next(new restify.InvalidArgumentError('ID must be supplied'));
        }
        else {
            var updatedData = req.params;
            delete updatedData._id;
            if(typeof updatedData.gps === 'string') {
                if(updatedData.gps != '') updatedData.gps = updatedData.gps.split(',');
                else updatedData.gps = [];
            }
            else {
                updatedData.gps = [];
            }
            Initiatives.update({ _id: req.params.id }, updatedData, { multi: false }, function(err, count, raw) {
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

    function findInitiatives(req, res, next) {
        if(req.params.gps !== undefined) {
            var gps = req.params.gps.split(',').map(function (elt) { return parseInt(elt); });
            console.log(gps);
            Initiatives.find({ gps: { $near: gps } }, function(err, collection) {
                res.send(collection === undefined ? [] :collection);
            });
        }
        else {
            return next(new restify.InvalidArgumentError('query is wrong'));
        }
    }

    var server = restify.createServer();
    server.use(restify.fullResponse());
    server.use(restify.bodyParser());
    server.use(restify.queryParser());

    server.post('/v1/initiatives', createNewInitiative);
    server.get('/v1/initiatives/:id', getInitiative);
    server.get('/v1/initiatives', getInitiatives);
    server.put('/v1/initiatives/:id', updateInitiative);
    server.del('/v1/initiatives/:id', deleteInitiative);

    server.get('/v1/find', findInitiatives);

    server.listen(8080, function() {
        console.log('%s listening at %s', server.name, server.url);
    });

};