module.exports = {
  restapi: {
    port: process.env.PORT || 8080,
    baseuri: 'http://localhost:8080'
  },
  db: {
    url: process.env.MONGOHQ_URL || 'mongodb://localhost/streetmix'
  },
  twitter: {
    oauth_consumer_key: process.env.TWITTER_OAUTH_CONSUMER_KEY,
    oauth_consumer_secret: process.env.TWITTER_OAUTH_CONSUMER_SECRET
  }
}
