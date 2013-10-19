exports.StartServer = function() {
   
    var restify = require('restify');
    
    function respond(req, res, next) {
        res.contentType = 'application/json';
        res.send({ code: 200, message: 'hello ' + req.params.name });
        res.end();
    }
    var server = restify.createServer();
    server.get('/hello/:name', respond);
    
    server.listen(8080, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
    
};