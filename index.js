var url = require('url')
var tokenKey = ':_authToken'

module.exports = function (registryUrl, opts) {
  var options = opts || {}
  var npmrc = require('rc')('npm', {registry: 'https://registry.npmjs.org/'})
  var parsed = url.parse(registryUrl || npmrc.registry, false, true)

  var match
  var pathname

  while (!match && pathname !== '/') {
    pathname = parsed.pathname || '/'
    var regUrl = '//' + parsed.host + pathname.replace(/\/$/, '')
    match = npmrc[regUrl + tokenKey] || npmrc[regUrl + '/' + tokenKey]

    if (match) {
      match = match.replace(/^\$\{?([^}]*)\}?$/, function (fullMatch, envVar) {
        return process.env[envVar]
      })
    }

    if (!options.recursive) {
      return match
    }

    parsed.pathname = url.resolve(pathname, '..')
  }

  return match
}
