require('strong-agent').profile(
  '23e668d1a3e634169754d51367ea4aff',
  ['Streetmix REST API','Heroku'],
  null
)

var config = require('config'),
    bunyan = require('bunyan'),
    restify = require('restify'),
    resources = require(__dirname + '/resources'),
    requestHandlers = require(__dirname + '/lib/request_handlers')

// Define server
var server = restify.createServer({
  name: 'streetmix-restapi',
  version: '0.0.1',
  log: bunyan.createLogger({name: 'streetmix-restapi', level: config.log_level})
})

server.on('MethodNotAllowed', requestHandlers.request_log)
server.on('MethodNotAllowed', requestHandlers.unknown_method_handler)

server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.CORS())
server.use(restify.fullResponse())
server.use(requestHandlers.login_token_parser)
server.use(requestHandlers.request_log)
server.use(requestHandlers.custom_cache_control_headers)
server.use(requestHandlers.request_id_echo)

// Routes
server.post('/v1/users', resources.v1.users.post)
server.get('/v1/users/:user_id', resources.v1.users.get)
server.put('/v1/users/:user_id', resources.v1.users.put)
server.del('/v1/users/:user_id/login-token', resources.v1.users.delete)
server.get('/v1/users/:user_id/streets', resources.v1.users_streets.get)

server.post('/v1/streets', resources.v1.streets.post)
server.get('/v1/streets', resources.v1.streets.find)
server.del('/v1/streets/:street_id', resources.v1.streets.delete)
server.get('/v1/streets/:street_id', resources.v1.streets.get)
server.put('/v1/streets/:street_id', resources.v1.streets.put)

server.post('/v1/feedback', resources.v1.feedback.post)

// Start server
server.listen(config.restapi.port, function() {
  server.log.info('%s listening at %s', server.name, server.url)
})
