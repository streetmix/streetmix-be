var mongoose = require('mongoose'),
    config = require('config'),
    uuid = require('uuid'),
    db = require('../../../lib/db.js'),
    Street = require('../../../models/street.js'),
    User = require('../../../models/user.js'),
    Sequence = require('../../../models/sequence.js')

exports.post = function(req, res) {

  var street = new Street()

  var body
  if (req.body && (req.body.length > 0)) {
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

    s.asJson(function(err, streetJson) {

      if (err) {
        console.error(err)
        res.send(500, 'Could not render street JSON.')
        return
      }

      res.header('Location', config.restapi.baseuri + '/v1/streets/' + s.id)
      res.send(201, streetJson)
    })

  } // END function - handleCreateStreet

  var handleNewStreetId = function(err, sequence) {
    if (err) {
      console.error(err)
      res.send(500, 'Could not create new street ID.')
      return
    }

    street.id = sequence.seq
    street.save(handleCreateStreet)

  } // END function - makeNewStreetId

  var handleFindStreet = function(err, origStreet) {

    if (!origStreet) {
      res.send(404, 'Original street not found.')
      return
    }

    street.original_street_id = origStreet

    Sequence.findByIdAndUpdate('streets',
                               { $inc: { 'seq': 1 } },
                               { new: true, upsert: true },
                               handleNewStreetId)

  } // END function - handleFindStreet

  var saveStreet = function() {

    if (body && body.originalStreetId) {
      Street.findById(body.originalStreetId, handleFindStreet)
    } else {
      Sequence.findByIdAndUpdate('streets',
                                 { $inc: { 'seq': 1 } },
                                 { new: true, upsert: true },
                                 handleNewStreetId)
    }

  } // END function - saveStreet

  var handleFindUser = function(err, user) {

    if (!user) {
      res.send(404, 'Creator not found.')
      return
    }
    
    street.creator_id = user
    saveStreet()

  } // END function - handleFindUser

  if (req.params.loginToken) {
    User.findOne({ login_token: req.params.loginToken }, handleFindUser)
  } else {
    saveStreet()
  }    

} // END function - exports.post

exports.delete = function(req, res) {

  var handleFindStreet = function(err, street) {

    if (err) {
      console.error(err)
      res.send(500, 'Could not find street.')
      return
    }

    if (!street) {
      res.send(404, 'Could not find street.')
      return
    }

    var handleFindUser = function(err, user) {

      if (err) {
        console.error(err)
        res.send(500, 'Could not find signed-in user.')
        return
      }
      
      if (!user) {
        res.send(401, 'User is not signed-in.')
        return
      }

      if (!street.creator_id) {
        res.send(403, 'Signed-in user cannot delete this street.')
        return
      }

      if (street.creator_id.toString() !== user._id.toString()) {
        res.send(403, 'Signed-in user cannot delete this street.')
        return
      }
      
      street.remove()
      res.send(204)

    } // END function - handleFindUser

    User.findOne({ login_token: req.params.loginToken }, handleFindUser)

  } // END function - handleFindStreet

  if (!req.params.loginToken) {
    res.send(401)
    return
  }

  if (!req.params.street_id) {
    res.send(400, 'Please provide street ID.')
    return
  }

  Street.findOne({ id: req.params.street_id }, handleFindStreet)

} // END function - exports.delete

exports.get = function(req, res) {

  var handleFindStreet = function(err, street) {

    if (err) {
      console.error(err)
      res.send(500, 'Could not find street.')
      return
    }

    if (!street) {
      res.send(404, 'Could not find street.')
      return
    }

    street.asJson(function(err, streetJson) {

      if (err) {
        console.error(err)
        res.send(500, 'Could not render street JSON.')
        return
      }

      res.header('Location', config.restapi.baseuri + '/v1/streets/' + street.id)
      res.send(200, streetJson)

    })
    
  } // END function - handleFindStreet

  if (!req.params.street_id) {
    res.send(400, 'Please provide street ID.')
    return
  }

  Street.findOne({ id: req.params.street_id }, handleFindStreet)

} // END function - exports.get

exports.put = function(req, res) {

  var body
  if (req.body && (req.body.length > 0)) {
    try {
      body = JSON.parse(req.body)
    } catch (e) {
      res.send(400, 'Could not parse body as JSON.')
      return
    }
  } else {
    res.send(400, 'Street information not specified.')
    return
  }

  var handleUpdateStreet = function(err, street) {

    if (err) {
      console.error(err)
      res.send(500, 'Could not update street.')
      return
    }

    res.send(204)
    
  } // END function - handleUpdateStreet

  var handleFindStreet = function(err, street) {

    if (err) {
      console.error(err)
      res.send(500, 'Could not find street.')
      return
    }

    if (!street) {
      res.send(404, 'Could not find street.')
      return
    }

    street.name = body.name || street.name
    street.data = body.data || street.data

    street.save(handleUpdateStreet)

  } // END function - handleFindStreet

  if (!req.params.street_id) {
    res.send(400, 'Please provide street ID.')
    return
  }

  Street.findOne({ id: req.params.street_id }, handleFindStreet)

} // END function - exports.put
