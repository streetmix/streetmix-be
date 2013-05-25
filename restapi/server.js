var config = require('config'),
    restify = require('restify'),
    resources = require(__dirname + '/resources')

// Define server
var server = restify.createServer({
  name: 'streetmix-restapi',
  version: '0.0.1'
})

server.use(restify.bodyParser())
server.use(restify.CORS())
server.use(restify.fullResponse())

// Routes
server.post('/v1/users', resources.v1.users.post)
server.get('/v1/users/:login_token', resources.v1.users.get)
server.del('/v1/users/:login_token/login-token', resources.v1.users.delete)

server.post('/v1/streets', resources.v1.streets.post)

// Start server
server.listen(config.restapi.port, function() {
  console.log('%s listening at %s', server.name, server.url)
})
