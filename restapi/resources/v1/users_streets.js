var mongoose = require('mongoose'),
    config = require('config'),
    async = require('async'),
    User = require('../../../models/user.js'),
    Street = require('../../../models/street.js')

exports.get = function(req, res) {

  var handleFindUser = function(err, user) {
   
    if (!user) {
      res.send(404, 'User not found.')
      return
    }

    var json = { streets: [] }

    var appendStreet = function(street, callback) {

      street.asJson(function(err, streetJson) {

        if (err) {
          callback(err)
          return
        }

        json.streets.push(streetJson)
        callback()

      })
      
    } // END function - appendStreet
    
    var handleFindStreets = function(err, streets) {
      
      if (err) {
        console.error(err)
        res.send(500, 'Could not find streets for user.')
        return
      }
      
      async.map(
        streets,
        appendStreet,
        function(err) {
          
          if (err) {
            console.error(err)
            res.send(500, 'Could not append street.')
            return
          }
          
          res.send(200, json)
          
        }) // END - async.map

    } // END function - handleFindStreets
  
    Street.find({ creator_id: user._id })
      .sort('-updated_at')
      .exec(handleFindStreets)
    
  } // END function - handleFindUser

  // Flag error if user ID is not provided
  if (!req.params.user_id) {
    res.send(400, 'Please provide user ID.')
    return
  }

  User.findOne({ id: req.params.user_id }, handleFindUser)

} // END function - exports.get
