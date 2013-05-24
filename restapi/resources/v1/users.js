var mongoose = require('mongoose'),
    uuid = require('uuid'),
    db = require('../../../lib/db.js'),
    User = require('../../../models/user.js')

exports.post = function(req, res) {

  var handleTwitterSignIn = function(twitter) {

    var handleCreateUser = function(err, user) {
      if (err) {
        console.error(err)
        res.send(500, 'Could not create user.')
        return
      }
      res.send(201, { login_token: user.login_token })

    } // END function - handleCreateUser

    var handleUpdateUser = function(err, user) {
      
      if (err) {
        console.error(err)
        res.send(500, 'Could not update user.')
        return
      }
      res.send(200, { login_token: user.login_token })

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
          },
          login_token: uuid.v1()
        })
        u.save(handleCreateUser)

      } else {
        user.username = twitter.screen_name,
        user.twitter_credentials = { 
          access_token: twitter.oauth_token,
          token_secret: twitter.oauth_token_secret
        }
        user.login_token = uuid.v1()
        user.save(handleUpdateUser)
      }

    } // END function - handleFindUser
    
    // Try to find user with twitter ID
    User.findOne({ twitter_id: twitter.user_id }, handleFindUser)

  } // END function - handleTwitterSignIn

  var body
  try {
    body = JSON.parse(req.body)
  } catch (e) {
    res.send(400, 'Could not parse body as JSON.')
    return
  }

  if (body.hasOwnProperty('twitter')) {
    handleTwitterSignIn(body.twitter)
  } else {
    res.send(400, 'Unknown sign-in method used.')
  }

} // END function - exports.post

exports.get = function(req, res) {

  var handleFindUser = function(err, user) {
    
    if (!user) {
      res.send(404, 'User not found.')
      return
    }

    res.send(200, user.asJson())
    
  } // END function - handleFindUser
  
  // Flag error if user ID is not provided
  if (!req.params.id) {
    res.send(400, 'Please provide user ID')
    return
  }

  var userId = req.params.id
  User.findById(userId, handleFindUser)

} // END function - exports.get
