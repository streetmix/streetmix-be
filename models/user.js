var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  username: { type: String, index: { unique: true } },
  twitter_id: String,
  twitter_credentials: mongoose.Schema.Types.Mixed,
  login_token: { type: String, index: { unique: true } }
})

userSchema.methods.asJson = function() {
  return {
    username: this.username
  }
}

module.exports = mongoose.model('User', userSchema)


