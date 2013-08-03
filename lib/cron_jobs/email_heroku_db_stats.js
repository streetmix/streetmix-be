var util = require('util'),
    async = require('async'),
    config = require('config'),
    MongoClient = require('mongodb').MongoClient,
    SendGrid = require('sendgrid').SendGrid

// Constants
var DB_CAPACITY_BYTES=512 * 1000 * 1000

var emailStats = function(stats) {

  var body = [
    '# of users = %d',
    '# of streets = %d',
    '# of default streets = %d',
    'DB storage size (MB) = %d',
    'DB storage utilization = %d%%'
  ].join("\n")

  body = util.format(body, stats.numUsers, stats.numStreets, stats.numDefaultStreets, stats.storageSizeMB, stats.storageUtilizationPercent)

  var sendgrid = new SendGrid(
    config.email.sendgrid.username,
    config.email.sendgrid.password
  )
 
  console.log('[email_heroku_db_stats] About to send stats email.')

  sendgrid.send({
    to: config.email.db_stats_recipient,
    from: config.email.db_stats_sender_default,
    subject: config.email.db_stats_subject,
    text: body
  }, function(success, message) {
    if (!success) {
      console.error('[email_heroku_db_stats] Error sending stats email. Error = ' + message)
      return
    }

    return console.log('[email_heroku_db_stats] Stats email sent.')

  })

} // END function - emailStats

module.exports = function() {

  console.log('[email_heroku_db_stats] Started script.')

  MongoClient.connect(config.db.url, function(err, db) {  

    console.log('[email_heroku_db_stats] Connected to DB.')

    if (err) { 
      return console.error('[email_heroku_db_stats] Could not connect to DB. Error = ' + err)
    }

    var getStorageSize = function(cb) {
      db.eval('db.stats().storageSize', null, null, cb)
    } // END function - getStorageSize

    var getNumStreets = function(cb) {
      db.collection('streets').count(null, null, cb)
    } // END function - getNumStreets

    var getNumDefaultStreets = function(cb) {
      db.collection('streets').count({ 'data.undoStack': { $size: 0 }}, null, cb)
    } // END function - getNumDefaultStreets

    var getNumUsers = function(cb) {
      db.collection('users').count(null, null, cb)
    } // END function - getNumUsers

    async.parallel([
      getNumStreets,
      getNumDefaultStreets,
      getNumUsers,
      getStorageSize
    ], function(err, results) {

      db.close()

      if (err) {
        return console.error('[email_heroku_db_stats] Could not query stats from DB. Error = ' + err)
      }

      console.log('[email_heroku_db_stats] Queried stats from DB.')

      var stats = {
        numStreets: results[0],
        numDefaultStreets: results[1],
        numUsers: results[2],
        storageSizeMB: results[3] / ( 1000 * 1000 )
      }
     
      stats.storageUtilizationPercent = results[3] * 100 / DB_CAPACITY_BYTES

      emailStats(stats)

    })

  })

}
