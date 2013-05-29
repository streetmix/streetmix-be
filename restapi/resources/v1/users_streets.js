var mongoose = require('mongoose'),
    config = require('config'),
    db = require('../../../lib/db.js'),
    User = require('../../../models/user.js'),
    Street = require('../../../models/street.js')

exports.get = function(req, res) {

  var handleFindUser = function(err, user) {
   
    if (!user) {
      res.send(404, 'User not found.')
      return
    }

    var json = { streets: [] }

    var handleFindStreets = function(err, streets) {

      if (err) {
        console.error(err)
        res.send(500, 'Could not find streets for user.')
        return
      }

      for (streetIndex in streets) {
        var street = streets[streetIndex]
        json.streets.push(street.asJson())
      }

      res.send(200, json)

    } // END function - handleFindStreets

    Street.find({ creatorId: user._id }, handleFindStreets)

  } // END function - handleFindUser

  // Flag error if user ID is not provided
  if (!req.params.user_id) {
    res.send(400, 'Please provide user ID.')
    return
  }

  User.findOne({ id: req.params.user_id }, handleFindUser)

} // END function - exports.get
