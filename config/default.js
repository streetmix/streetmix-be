process.env.NODE_ENV = process.env.NODE_ENV || 'development'

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
  },
  email: {
    sendgrid: {
      username: process.env.SENDGRID_USERNAME,
      password: process.env.SENDGRID_PASSWORD
    },
    feedback_recipient: "streetmix@codeforamerica.org",
    feedback_subject: "Feedback from user (in " + process.env.NODE_ENV + " environment)",
    feedback_sender_default: "noreply@codeforamerica.org"
  }
}
