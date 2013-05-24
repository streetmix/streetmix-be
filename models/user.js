var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  username: { type: String, index: { unique: true } },
  profile_image_uri: String,
  twitter_id: String,
  twitter_credentials: mongoose.Schema.Types.Mixed,
  login_token: { type: String, index: { unique: true } }
})

userSchema.methods.asJson = function() {
  return {
    username: this.username,
    profile_image_uri: this.profile_image_uri
  }
}

module.exports = mongoose.model('User', userSchema)


