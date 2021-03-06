Conscious India API
===================

## API doc
- `GET /v1/initiatives` : get a JSON with all initiatives in the database
- `GET /v1/initiatives/:id` : get a JSON with details of the initiative with :id
- `POST /v1/initiatives` : add a initiatives to the database
- `PUT /v1/initiatives/:id` : change details of the initiative with :id
- `DELETE /v1/initiatives/:id` : delete from the database the initiative with :id
- `GET /v1/find` : get a JSON with filtered initiatives

## Authorization
User must first ask for a access token with: `curl http://localhost:8080/accessToken -H "Content-Type: application/json" -d '{"username": "username", "password": "password"}'`.

Then the access-token must be add to the request header like that : `curl http://localhost:8080/v1/initiatives -H "Authorization: Access-Token <ACCESS_TOKEN>" -H "Content-Type: application/json" -d '{"name": "update2", "geocode": [45,0]}'`.

The authorization checks the username, the password, the client name/id and a passphrase. Those information are stored in auth-config.js (@see auth-config-sample.js)

## Useful links
- [start a simple web server](http://blog.ticabri.com/blog/2013/08/31/start-simple-web-server/)
- [backbone.js](http://backbonejs.org)
- [github : backbone.js beginner video tutorial](https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/videos/beginner)
- [youtube : backbone.js tutorial - beginners](http://youtu.be/FZSjvWtUxYk)
- [mongodb manual](http://docs.mongodb.org/manual/)
- [restify](http://mcavage.me/node-restify/)
- [backbonetutorials.com : node.js, restify, mongodb and mongoose](http://backbonetutorials.com/nodejs-restify-mongodb-mongoose/)
- [mongoose](http://mongoosejs.com/index.html)
- [geospatial indexing in mongodb](https://docs.google.com/presentation/d/1Xap-Iv0X9uyHix1DUgX36SE_oe_y3F7c_L_VoThtKlo/present#slide=id.i0)
- [tutorial : node.js and mongodb json rest api server with mongoskin and express.js](http://webapplog.com/tutorial-node-js-and-mongodb-json-rest-api-server-with-mongoskin-and-express-js/)
- [regression testing node.js services with restify and mocha](http://tech.flurry.com/2012/10/03/regression-testing-api-services-with-restify/)
- [creating a basic node.js api with restify and save](http://synthmedia.co.uk/blog/basic-nodejs-api-with-restify-and-save)
