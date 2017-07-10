const config = require('config')
const FacebookStrategy = require('passport-facebook').Strategy

module.exports = function (app, passport, models) {
  passport.use(new FacebookStrategy({
    clientID: config.get('FACEBOOK_APP_ID'),
    clientSecret: config.get('FACEBOOK_APP_SECRET'),
    callbackURL: 'http://localhost:3000/users/facebook/callback'
  },
    function (accessToken, refreshToken, profile, cb) {
      // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  ))

  app.get('/users/facebook/callback', passport.authorize('facebook'), function (req, res) {
    req.logIn(req.account.toJSON(), (err) => {
      console.log(err)
      return res.redirect('/feedback')
    })
  })
  app.get('/users/facebook', passport.authorize('facebook', {authType: 'rerequest', scope: ['email']}))
}
