var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  username: String,
  twitter_id: String,
  twitter_credentials: mongoose.Schema.Types.Mixed
})

userSchema.methods.asJson = function() {
  return {
    id: this._id,
    username: this.username
  }
}

module.exports = mongoose.model('User', userSchema)


