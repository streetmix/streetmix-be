var mongoose = require('mongoose'),
    config = require('config'),
    db = require('../../../lib/db.js'),
    Street = require('../../../models/street.js'),
    User = require('../../../models/user.js')

exports.post = function(req, res) {

  var body
  try {
    body = JSON.parse(req.body)
  } catch (e) {
    res.send(400, 'Could not parse body as JSON.')
    return
  }

  var street = new Street({
    name: body.name,
    data: body.data
  })

  var handleCreateStreet = function(err, s) {
    if (err) {
      console.error(err)
      res.send(500, 'Could not create street.')
      return
    }
    res.header('Location', config.restapi.baseuri + '/v1/streets/' + s._id)
    res.send(201, s.asJson())
  } // END function - handleCreateStreet

  var handleFindStreet = function(err, origStreet) {

    if (!origStreet) {
      res.send(404, 'Original street not found.')
      return
    }

    street.originalStreetId = origStreet

    street.save(handleCreateStreet)

  } // END function - handleFindStreet

  var handleFindUser = function(err, user) {

    if (!user) {
      res.send(404, 'Creator not found.')
      return
    }
    
    street.creatorId = user
    
    if (body.originalStreetId) {
      Street.findById(body.originalStreetId, handleFindStreet)
    } else {
      street.save(handleCreateStreet)
    }

  } // END function - handleFindUser

  if (body.creatorId) {
    User.findById(body.creatorId, handleFindUser)
  }

} // END function - exports.post
