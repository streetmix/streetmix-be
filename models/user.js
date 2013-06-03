var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  id: { type: String, index: { unique: true } },
  twitter_id: String,
  twitter_credentials: mongoose.Schema.Types.Mixed,
  login_tokens: [ String ],
  data: mongoose.Schema.Types.Mixed
})

userSchema.methods.asJson = function(options, cb) {
  options = options || {}

  var json = {}

  if (options.auth) {
    json.data = this.data
  }

  cb(null, json)
}

module.exports = mongoose.model('User', userSchema)
