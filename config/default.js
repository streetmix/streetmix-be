module.exports = {
  restapi: {
    port: process.env.PORT || 8080,
    baseuri: 'http://localhost:8080'
  },
  db: {
    url: process.env.MONGOHQ_URL || 'mongodb://localhost/streetmix'
  }
}
