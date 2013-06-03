var mongoose = require('mongoose'),
    async = require('async'),
    User = require('./user.js')

var streetSchema = new mongoose.Schema({
  id: { type: String, index: { unique: true } },
  name: String,
  creator_id: { type: mongoose.Schema.ObjectId, ref: mongoose.model('User')},
  data: mongoose.Schema.Types.Mixed,
  created_at: Date,
  updated_at: Date
})

streetSchema.add({
  original_street_id: { type: mongoose.Schema.ObjectId, ref: streetSchema},
})


streetSchema.pre('save', function(next) {
  var now = new Date()
  this.updated_at = now
  this.created_at = this.created_at || now
  next()
})

streetSchema.methods.asJson = function(cb) {

  var json = {
    id: this.id,
    name: this.name,
    data: this.data,
    createdAt: this.created_at,
    updatedAt: this.updated_at
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
