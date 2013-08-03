process.env.NODE_ENV = process.env.NODE_ENV || 'development'
var port = process.env.PORT || 8080

module.exports = {
  restapi: {
    port: port,
    baseuri: 'http://localhost:' + port
  },
  db: {
    url: process.env.MONGOHQ_URL || 'mongodb://localhost/streetmix'
  },
  twitter: {
    oauth_consumer_key: process.env.TWITTER_OAUTH_CONSUMER_KEY,
    oauth_consumer_secret: process.env.TWITTER_OAUTH_CONSUMER_SECRET,
    timeout_ms: 500
  },
  email: {
    sendgrid: {
      username: process.env.SENDGRID_USERNAME,
      password: process.env.SENDGRID_PASSWORD
    },
    feedback_recipient: process.env.EMAIL_FEEDBACK_RECIPIENT || "streetmix@codeforamerica.org",
    feedback_subject: "Streetmix feedback",
    feedback_sender_default: "noreply@codeforamerica.org",
    db_stats_recipient: "shaunak@codeforamerica.org",
    db_stats_subject: "Database statistics for " + process.env.NODE_ENV + " environment",
    db_stats_sender_default: "noreply@codeforamerica.org"
  },
  log_level: 'debug'
}
