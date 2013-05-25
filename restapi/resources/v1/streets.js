var mongoose = require('mongoose'),
    config = require('config'),
    uuid = require('uuid'),
    db = require('../../../lib/db.js'),
    Street = require('../../../models/street.js'),
    User = require('../../../models/user.js')

exports.post = function(req, res) {

  var street = new Street()
  street.id = uuid.v1()

  var body
  if (req.body.length > 0) {
    try {
      body = JSON.parse(req.body)
    } catch (e) {
      res.send(400, 'Could not parse body as JSON.')
      return
    }

    // TODO: Validation

    street.name = body.name
    street.data = body.data
  }

  var handleCreateStreet = function(err, s) {
    if (err) {
      console.error(err)
      res.send(500, 'Could not create street.')
      return
    }
    res.header('Location', config.restapi.baseuri + '/v1/streets/' + s.id)
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

  var saveStreet = function() {

    if (body && body.originalStreetId) {
      Street.findById(body.originalStreetId, handleFindStreet)
    } else {
      street.save(handleCreateStreet)
    }

  } // END function - saveStreet

  var handleFindUser = function(err, user) {

    if (!user) {
      res.send(404, 'Creator not found.')
      return
    }
    
    street.creatorId = user
    saveStreet()

  } // END function - handleFindUser

  if (req.params.loginToken) {
    User.findOne({ login_token: req.params.loginToken }, handleFindUser)
  } else {
    saveStreet()
  }    


} // END function - exports.post
