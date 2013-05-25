var mongoose = require('mongoose'),
    config = require('config'),
    uuid = require('uuid'),
    twitter = require('twitter'),
    db = require('../../../lib/db.js'),
    User = require('../../../models/user.js')

exports.post = function(req, res) {

  var handleTwitterSignIn = function(twitterCredentials) {

    // TODO: Call Twitter API with OAuth access credentials to make sure they are valid

    var handleCreateUser = function(err, user) {
      if (err) {
        console.error(err)
        res.send(500, 'Could not create user.')
        return
      }
      res.header('Location', config.restapi.baseuri + '/v1/users/' + user.id)
      res.send(201, { id: user.id, loginToken: user.login_token })

    } // END function - handleCreateUser

    var handleUpdateUser = function(err, user) {
      
      if (err) {
        console.error(err)
        res.send(500, 'Could not update user.')
        return
      }
      res.header('Location', config.restapi.baseuri + '/v1/users/' + user.id)
      res.send(200, { id: user.id, loginToken: user.login_token })

    } // END function - handleUpdateUser

    var handleFindUser = function(err, user) {
      
      if (err) {
        console.error(err)
        res.send(500, 'Error finding user with Twitter ID.')
        return
      }
      
      if (!user) {
        var u = new User({
          id: uuid.v1(),
          username: twitterCredentials.screenName,
          twitter_id: twitterCredentials.userId,
          twitter_credentials: {
            access_token_key: twitterCredentials.oauthAccessTokenKey,
            access_token_secret: twitterCredentials.oauthAccessTokenSecret
          },
          login_token: uuid.v1()
        })
        u.save(handleCreateUser)

      } else {
        user.username = twitterCredentials.screenName,
        user.twitter_credentials = { 
          access_token_key: twitterCredentials.oauthAccessTokenKey,
          access_token_secret: twitterCredentials.oauthAccessTokenSecret
        }
        user.login_token = uuid.v1()
        user.save(handleUpdateUser)
      }

    } // END function - handleFindUser
    
    // Try to find user with twitter ID
    User.findOne({ twitter_id: twitterCredentials.userId }, handleFindUser)

  } // END function - handleTwitterSignIn

  var body
  try {
    body = JSON.parse(req.body)
  } catch (e) {
    res.send(400, 'Could not parse body as JSON.')
    return
  }

  if (body.hasOwnProperty('twitter')) {

    // TODO: Validation

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

    var twitterApiClient = new twitter({
      consumer_key: config.twitter.oauth_consumer_key,
      consumer_secret: config.twitter.oauth_consumer_secret,
      access_token_key: user.twitter_credentials.access_token_key,
      access_token_secret: user.twitter_credentials.access_token_secret
    })

    var handleFetchUserProfileFromTwitter = function(data) {
    
      var userJson = user.asJson()
      userJson.profileImageUrl = data.profile_image_url

      res.send(200, userJson)

    } // END function - handleFetchUserProfileFromTwitter
    
    twitterApiClient.get('/users/show.json', { user_id: user.twitter_id }, handleFetchUserProfileFromTwitter)
    
  } // END function - handleFindUser
  
  // Flag error if user ID is not provided
  if (!req.params.user_id) {
    res.send(400, 'Please provide user ID.')
    return
  }

  var userId = req.params.user_id
  User.findOne({ id: userId }, handleFindUser)

} // END function - exports.get

exports.delete = function(req, res) {

  var handleSaveUser = function(err, user) {

    if (err) {
      console.error(err)
      res.send(500, 'Could not sign-out user.')
      return
    }
    res.send(204)

  } // END function - handleSaveUser

  var handleFindUser = function(err, user) {

    if (!user) {
      res.send(404, 'User not found.')
      return
    }

    if (user.login_token != req.params.loginToken) {
      res.send(401)
      return
    }

    user.login_token = null
    user.save(handleSaveUser)

  } // END function - handleFindUser

  // Flag error if user ID is not provided
  if (!req.params.user_id) {
    res.send(400, 'Please provide user ID.')
    return
  }

  var userId = req.params.user_id
  User.findOne({ id: userId }, handleFindUser)

} // END function - exports.delete
