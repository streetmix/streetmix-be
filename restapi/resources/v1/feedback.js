var config = require('config'),
    SendGrid = require('sendgrid').SendGrid

exports.post = function(req, res) {

  // Validation
  var body
  try {
    body = JSON.parse(req.body)
  } catch (e) {
    res.send(400, 'Could not parse body as JSON.')
    return
  }

  if (!body.hasOwnProperty('message') || (body.message.trim().length === 0)) {
    res.send(400, 'Please specify a message.')
    return
  }
  var message = body.message.trim()

  // Append useful information to message
  var referer = req.headers.referer || '(not specified)'
  var remoteAddress = req.connection.remoteAddress || req.headers['X-Forwarded-For']
  message += "\n\n"
    + "---\n"
    + "URL of originating page: " + referer + "\n"
    + "User's IP address: " + remoteAddress + "\n"

  var to = [ config.email.feedback_recipient ]
  var from
  if (body.from) {
    var matches = body.from.match(/\w+@\w+\.\w+/)
    if (matches && (matches.length > 0)) {
      from = matches[0]
      to.push(from)
    }
  }
      
  var sendgrid = new SendGrid(
    config.email.sendgrid.username,
    config.email.sendgrid.password
  )

  var subject = config.email.feedback_subject;
  if (from) {
    subject += ' from ' + from;
  }

  sendgrid.send({
    to: to,
    from: from || config.email.feedback_sender_default,
    subject: subject,
    text: message
  }, function(success, message) {
    if (!success) {
      console.error('Error sending email using SendGrid: ' + message)
      res.send(500, 'Could not send feedback.')
      return
    }
    res.send(202, 'Feedback accepted.')
  })

} // END function - exports.post
