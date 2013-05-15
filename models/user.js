var mongoose = require('mongoose')

module.exports = mongoose.model('User', new mongoose.Schema({
  username: String,
  twitter_id: String,
  twitter_credentials: mongoose.Schema.Types.Mixed
}))


