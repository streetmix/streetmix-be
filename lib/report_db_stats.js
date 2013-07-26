var sys = require('sys'),
    exec = require('child_process').exec,
    config = require('config'),
    SendGrid = require('sendgrid').SendGrid


// Constants
var DB_CAPACITY_BYTES=496 * 1000 * 1000
var WARNING_THRESHOLD_PERCENT=65
var CRITICAL_THRESHOLD_PERCENT=90

// Logging functions
var logError = function(msg) { console.error('[email_db_stats] %s', msg); }

// Other functions
var sendEmail = function(subject, body) {

  var sendgrid = new SendGrid(
    config.email.sendgrid.username,
    config.email.sendgrid.password
  )

  sendgrid.send({
    to: config.email.db_stats_recipient,
    from: config.email.feedback_sender_default,
    subject: subject,
    text: body
  }, function(success, message) {
    if (!success) {
      return logError('Error sending email using SendGrid: ' + message)
    }
  })

} // END function - sendEmail

var handleShellCommandExecution = function(reportWhenNormal) {

  return function(err, stdout, stderr) {

    if (err) {
      return logError(err)
    }

    var currentDbSizeBytes = stdout.toString().trim()
    var percentUsed = (currentDbSizeBytes * 100 / DB_CAPACITY_BYTES).toFixed(2)

    // Determine state - normal, warning or critical
    var state
    if (percentUsed > CRITICAL_THRESHOLD_PERCENT) {
      state = "critical"
    } else if (percentUsed > WARNING_THRESHOLD_PERCENT) {
      state = "warning"
    } else {
      state = "normal"
    }

    // Send email
    if (reportWhenNormal || (state != "normal")) {
      var subject = "Database size is " + state
      var body = "Current size        = " + currentDbSizeBytes + " bytes.\n"
               + "Capacity            = " + DB_CAPACITY_BYTES + " bytes.\n"
               + "Percent utilization = " + percentUsed + "% \n"
               + "\n"
               + "--\n"
               + "Time on server is " + (new Date()).toString() + "\n"

      sendEmail(subject, body)
    }
  
  } 
  
} // END function - handleShellCommandExecution

// Main
module.exports = function(reportWhenNormal) {

  return function() {

    var cmd = "mongo streetmix --quiet --eval 'printjson(db.stats().dataSize)'"
    var child = exec(cmd, handleShellCommandExecution(reportWhenNormal))

  }

}
