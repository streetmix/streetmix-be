var mongoose = require('mongoose'),
    userSchema = require('./user.js').schema

var streetSchema = new mongoose.Schema({
  name: String,
  creatorId: { type: mongoose.Schema.ObjectId, ref: mongoose.model('User')},
  data: mongoose.Schema.Types.Mixed
})

streetSchema.add({
  originalStreetId: { type: mongoose.Schema.ObjectId, ref: streetSchema},
})

streetSchema.methods.asJson = function() {
  var json = {
    id: this._id,
    data: this.data
  }

  if (this.creatorId) {
    json.creatorId = this.creatorId
  }

  if (this.originalStreetId) {
    json.originalStreetId = this.originalStreetId
  }

  return json
}
    

module.exports = mongoose.model('Street', streetSchema)
