const config = require('config')
const FacebookTokenStrategy = require('passport-facebook-token')

module.exports = function (app, passport, models) {
  passport.use(new FacebookTokenStrategy({
    clientID: config.get('FACEBOOK_APP_ID'),
    clientSecret: config.get('FACEBOOK_APP_SECRET')
  }, async (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    const user = await models.user.findOrCreateByFB(profile)
    done(null, user)
  }))
  app.get('/users/facebook', (req, res, next) => {
    if (!req.query.access_token) {
      return next({
        access_token: {
          isEmpty: 'failed'
        },
        source: 'validation'
      })
    }
    next()
  },
    passport.authenticate('facebook-token'), (req, res) => {
      res.json({
        ok: true,
        token: req.user.get('token')
      })
    }
  )
}
