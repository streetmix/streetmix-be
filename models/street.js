var mongoose = require('mongoose'),
    async = require('async'),
    User = require('./user.js')

var streetSchema = new mongoose.Schema({
  id: { type: String, index: { unique: true } },
  name: String,
  creator_id: { type: mongoose.Schema.ObjectId, ref: mongoose.model('User')},
  data: mongoose.Schema.Types.Mixed
})

streetSchema.add({
  original_street_id: { type: mongoose.Schema.ObjectId, ref: streetSchema},
})

streetSchema.methods.asJson = function(cb) {

  var json = {
    id: this.id,
    name: this.name,
    data: this.data
  }

  var creatorId = this.creator_id
  var originalStreetId = this.original_street_id

  var appendCreator = function(callback) {
    if (creatorId) {
      User.findById(creatorId, function(err, creator) {
        if (err) {
          callback(err)
        } else {
          creator.asJson(null, function(err, creatorJson) {
            if (err) {
              callback(err)
            } else {
              json.creator = creatorJson
              callback()
            } // END else
          })
        } // END else
      })
    } else {
      callback()
    }
     
  } // END function - appendCreator

  var appendOriginalStreet = function(callback) {
    if (originalStreetId) {
      User.findById(originalStreetId, function(err, originalStreet) {
        if (err) {
          callback(err)
        } else {
          originalStreet.asJson(function(err, originalStreetJson) {
            if (err) {
              callback(err)
            } else {
              json.originalStreet = originalStreetJson
              callback()
            } // END else
          })
        } // END else
      })
    } else {
      callback()
    }

  } // END function - appendOriginalStreet

  async.parallel([
    appendCreator,
    appendOriginalStreet
  ], function(err) {
    cb(err, json)
  })

}
    

module.exports = mongoose.model('Street', streetSchema)
