var util = require(__dirname + '/../util.js')

module.exports = function(req, res, next) {
  req.params.loginToken = util.parseLoginToken(req)
  next()
} // END function - loginTokenParser

