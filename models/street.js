var mongoose = require('mongoose'),
    userSchema = require('./user.js').schema

var streetSchema = new mongoose.Schema({
  id: String,
  name: String,
  creatorId: { type: mongoose.Schema.ObjectId, ref: mongoose.model('User')},
  data: mongoose.Schema.Types.Mixed
})

streetSchema.add({
  originalStreetId: { type: mongoose.Schema.ObjectId, ref: streetSchema},
})

streetSchema.methods.asJson = function() {
  return {
    id: this.id,
    name: this.name,
    data: this.data,
    creatorId: this.creatorId,
    originalStreetId: this.originalStreetId
  }
}
    

module.exports = mongoose.model('Street', streetSchema)
