var async = require('async'),
    mongoose = require('mongoose'),
    db = require('../../lib/db.js'),
    Street = require('../../models/street.js')

exports.get = function(req, res) {

  var response = {
    status: null,
    updated: null,
    dependencies: [],
    resources: {}
  }

  response.dependencies = [ 'facebook', 'twitter', 'sendgrid', 'mongohq', 'papertrail' ]
  response.updated = Math.floor(new Date().getTime() / 1000)

  async.parallel([
    fetchStreetFromDb
    ],
    function(err, results) {
      if (err) {
        response.status = err
      } else {
        response.status = 'ok'
      }
      res.send(200, response)
    }
  )

}

var fetchStreetFromDb = function(cb) {

  Street.count({}, function(err, count) {
    if (err) {
      cb(err)
    } else if (count == 0) {
      cb("0 streets returned.")
    } else {
      cb()
    }
  })

}
