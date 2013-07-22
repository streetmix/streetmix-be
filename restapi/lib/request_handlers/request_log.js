var dateformat = require('dateformat')

module.exports = function(req, res, next) {
  var loginToken = ''
  if (req.params && req.params.loginToken) {
    loginToken = req.params.loginToken
  }
  var contentType = req.headers['content-type'] || ''
  var body = req.body || ''
  var now = new Date()
  var date = dateformat(now, "m/d/yyyy H:MM:ss Z")
  req.log.debug({ method: req.method, url: req.url, content_type: contentType, body: body, login_token: loginToken})
  next()
}
