var mongoose = require('mongoose'),
    userSchema = require('./user.js').schema

var streetSchema = new mongoose.Schema({
  id: { type: String, index: { unique: true } },
  name: String,
  creator_id: { type: mongoose.Schema.ObjectId, ref: mongoose.model('User')},
  data: mongoose.Schema.Types.Mixed
})

streetSchema.add({
  original_street_id: { type: mongoose.Schema.ObjectId, ref: streetSchema},
})

streetSchema.methods.asJson = function() {
  return {
    id: this.id,
    name: this.name,
    data: this.data,
    creatorId: this.creator_id,
    originalStreetId: this.original_street_id
  }
}
    

module.exports = mongoose.model('Street', streetSchema)
