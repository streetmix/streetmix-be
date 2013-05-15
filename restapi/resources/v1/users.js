var mongoose = require('mongoose'),
    db = require('../../../lib/db.js'),
    User = require('../../../models/user.js')

var handleUnknownBody = function(req, res, body) {

  res.send(400, 'Unknown sign in method used.')

}

var handleTwitterSignIn = function(req, res, twitter) {

  var sendUserResponse = function(code, user) {
    res.send(code, {
      id: user._id,
      username: user.username
    })
  } // END function - sendUserResponse
  
  var handleCreateUser = function(err, user) {
    if (err) {
      console.error(err)
      res.send(500, 'Could not create user.')
      return
    }
    sendUserResponse(201, user)

  } // END function - handleCreateUser

  var handleUpdateUser = function(err, user) {
    
    if (err) {
      console.error(err)
      res.send(500, 'Could not update user.')
      return
    }
    sendUserResponse(200, user)

  } // END function - handleUpdateUser

  var handleFindUser = function(err, user) {
    
    if (err) {
      console.error(err)
      res.send(500, 'Error finding user with Twitter ID.')
      return
    }
    
    if (!user) {
      var u = new User({
        username: twitter.screen_name,
        twitter_id: twitter.user_id,
        twitter_credentials: {
          access_token: twitter.oauth_token,
          token_secret: twitter.oauth_token_secret
        }
      })
      u.save(handleCreateUser)

    } else {
      user.username = twitter.screen_name,
      user.twitter_credentials = { 
        access_token: twitter.oauth_token,
        token_secret: twitter.oauth_token_secret
      }
      user.save(handleUpdateUser)
    }

  } // END function - handleFindUser
  
  // Try to find user with twitter ID
  User.findOne({ twitter_id: twitter.user_id }, handleFindUser)

}

exports.post = function(req, res) {

  var body
  try {
    body = JSON.parse(req.body)
  } catch (e) {
    res.send(400, 'Could not parse body as JSON.')
    return
  }

  if (body.hasOwnProperty('twitter')) {
    handleTwitterSignIn(req, res, body.twitter)
  } else {
    handleUnknownBody(req, res, body)
  }

}
