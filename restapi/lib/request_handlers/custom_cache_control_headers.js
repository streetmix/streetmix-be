module.exports = function(req, res, next) {
  res.header('Pragma', 'no-cache')
  res.header('Cache-Control', 'no-cache, no-store')
  res.header('Expires', 0)
  next()
} // END function - customCacheControlHeaders
