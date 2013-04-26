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

// Start server
server.listen(config.restapi.port, function() {
  console.log('%s listening at %s', server.name, server.url)
})
