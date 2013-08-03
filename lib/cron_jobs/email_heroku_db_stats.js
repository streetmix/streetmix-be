var childProcess = require('child_process')

module.exports = function() {

  console.log("About to call script...")
  var scriptPath = __dirname + '/../../bin/email_heroku_db_stats.sh'
  var child = childProcess.exec(scriptPath, function(err, stdout, stderr) {

    console.log("Script returned")
    if (err) {
      console.error('Error executing ' + scriptPath)
      return
    }

    console.log("Script stdout = " + stdout)
    console.error("Script stderr = " + stderr)

  })

} // END function - module.exports
