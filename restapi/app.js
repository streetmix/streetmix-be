var config = require('config'),
    server = require(__dirname + '/server.js')

// Start server
server.listen(config.restapi.port, function() {
  console.log('%s listening at %s', server.name, server.url)
})
