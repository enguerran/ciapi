exports.StartServer = function() {

    var restify = require('restify');
    var mongoose = require('mongoose');
    var configmongodb = require('./config');
    
    var db = mongoose.connect(configmongodb.creds.mongoose_auth_local);
    var Schema = mongoose.Schema;
    var InitiativesSchema = new Schema({
        name: { type: String, unique: true },
        contact: {
            address: {
                pin: { type: String},
                city: { type: String},
                neighbourghood: { type: String },
                street: { type: String }
            },
            phone: [
                {
                    label: { type: String},
                    number: { type: String }
                }
            ],
            email: [
                {
                    label: { type: String },
                    addresse: { type: String }
                }
            ],
            website: { type: String }
        },
        geocode: { type: {}, index: '2dsphere' },
        sector: { type: String},
        legalStatus: { type: String },
        tags: { type: [String]},
        description: { type: String },
        meta: {
            favorite: { type: Boolean },
            published: { type: Boolean },
            created: { type: Date, default: Date.now },
            updated: { type: Date, default: Date.now}
        }
    });
    mongoose.model('Initiatives', InitiativesSchema);
    var Initiatives = mongoose.model('Initiatives');

    function createNewInitiative(req, res, next) {
        if (req.params.name === undefined) {
            return next(new restify.InvalidArgumentError('Name must be supplied'));
        }
        else {
            var initiatives = new Initiatives(req.params);
            initiatives.save(function(err, data) {
                if (err) {
                    return next(new restify.InvalidContentError(err.err));
                }
                res.send([data]);
                return next();
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
                return next;
            })
        }
    }

    function getInitiatives(req, res, next) {
        Initiatives.find(function(err, initiatives) {
                res.send(initiatives);
                return next();
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
                    return next(new restify.InvalidContentError(err.err));
                }
                else {
                    res.send((count===1)?{ msg: 'success' }:{ msg: 'error'});
                    return next
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
                    return next(new restify.InvalidContentError(err.err));
                }
                else {
                    res.send((count===1)?{ msg: 'success' }:{ msg: 'error'});
                    return next();
                }
            });
        }
    }

    function findInitiatives(req, res, next) {
        var query = {};

        // q=keyword -> search keyword in the name and others metadata of the initiatives
        if(req.params.q !== undefined) {
            return next(new restify.InvalidArgumentError("'q' is not yet implemented..."));
        }

        // geocode=lat,long[,rad] -> search initiatives in the area centered in lat,long and with the radius rad
        if(req.params.geocode !== undefined) {
            var geocode = { array: req.params.geocode.split(',') };
            if(geocode.array.length >= 2 && geocode.array.length <= 3) {
                geocode.latitude = parseFloat(geocode.array[0]);
                geocode.longitude = parseFloat(geocode.array[1]);
                if(geocode.array[2]) {
                    geocode.distance = geocode.array[2];
                }
                query.geocode = { $near: { $geometry: { type: "Point", coordinates: [geocode.latitude, geocode.longitude] } } };
            }
            else {
                return next(new restify.InvalidArgumentError("geocode is not in a correct format"));
            }
        }

        Initiatives.find(query, function(err, collection) {
            res.send(collection === undefined ? [] :collection);
            return next();
        });
    }

    function getAccessToken(req, res, next) {
        var plaintext = {
            passphrase: "hello",
            client: {
                name: "consciousindia website",
                id: "12345"
            },
            expire: new Date(2013,12,30)
        };

        var password = "consciousindia";

        if(req.params.user === "admin") {
            plaintext.user = {};
            plaintext.user.login = req.params.user;
            plaintext.user.password = req.params.password;
        }
        else {
            return next(new restify.NotAuthorizedError("Check your credentials."));
        }

        res.send(_encrypt(JSON.stringify(plaintext), password).join(""));
    }

    function _encrypt(plaintext, password) {
        var cipher = crypto.createCipher("aes192", password);
        var msg = [];
        msg.push(cipher.update(plaintext, "binary", "hex"));
        msg.push(cipher.final("hex"));

        return msg;
    }

    function _decrypt(ciphertext, password) {
        var decipher = crypto.createDecipher("aes192", password);
        var msg = [];

        msg.push(decipher.update(ciphertext, "hex", "binary"));
        msg.push(decipher.final("binary"));

        return msg;
    }

    function isValid(key, req) {
        var password = "consciousindia";
        var data = JSON.parse(_decrypt(key, password).join(""));
        console.log(data);
        if(Date.parse(data.expire) >= Date.now()) {
            if(data.passphrase === "hello") {
                if(req.method === "GET") {
                    return true;
                }
                // TODO: Store login and password in db
                // TODO: encrypt password and use https
                else if(data.user && data.user.login === "admin" && data.user.password === "password") {
                    console.log("user identified: " + data.user.login + ":" + data.user.password);
                    return true;
                }
            }
        }
        else {
            console.log("expirated");   
        }
        return false;
    }

    var server = restify.createServer();
    server.use(restify.fullResponse());
    server.use(restify.bodyParser());
    server.use(restify.queryParser());

    var crypto = require("crypto");
    server.post('/accessToken', getAccessToken);

    server.use(function(req,res,next) {
        if(req.headers.authorization) {
            var key = req.headers.authorization.split(" ")[1];
            if(isValid(key, req)) {
                next();
            }
        }
        return next(new restify.NotAuthorizedError("You need an apikey."));
    });

    server.post('/v1/initiatives', createNewInitiative);
    server.get('/v1/initiatives/:id', getInitiative);
    server.get('/v1/initiatives', getInitiatives);
    server.put('/v1/initiatives/:id', updateInitiative);
    server.del('/v1/initiatives/:id', deleteInitiative);

    server.get('/v1/search', findInitiatives);

    server.listen(8080, function() {
        console.log('%s listening at %s', server.name, server.url);
    });

};