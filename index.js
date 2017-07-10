const helmet = require('helmet')
const winston = require('winston')
const requireDir = require('require-dir')
const config = require('config')
const app = require('express')()
const server = require('http').Server(app)

module.exports = app

try {
  const router = requireDir('./routes')
  const bodyParser = require('body-parser')

  app.use(helmet())
  app.use(bodyParser.json({limit: '1mb'}))
  app.use(bodyParser.urlencoded({extended: true}))

  server.listen(config.get('port'), (res) => console.log(`API started on ${config.get('port')}`))

  const knex = require('knex')({
    client: 'pg',
    connection: config.get('db.connection'),
    debug: config.get('debug')
  })
  const bookshelf = require('bookshelf')(knex)
  const models = requireDir('./models')

  for (let model in models) {
    models[model] = models[model](bookshelf)
  }

  const passport = require('passport')
  app.use(passport.initialize())
  app.use(passport.session())
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async function (id, done) {
    try {
      let user = await models.user.forge({id}).fetch({require: true})
      done(null, user.toJSON())
    } catch (e) {
      done(e.stack)
      winston.error(e.stack)
    }
  })
  require('./passport/facebook')(app, passport, models)

  app.use(function (req, res, next) {
    req.models = models
    req.logger = winston
    next()
  })

  winston.info('init API')
  const controllers = requireDir('./controllers')
  for (let routeName in router) {
    let controller = controllers[routeName]
    let route = router[routeName](controller)
    app.use('/' + routeName, route)
    if (config.get('debug')) {
      route.stack.map((r) => {
        if (!r.route) return
        let methods = Object.keys(r.route.methods)
        methods.forEach((m) => winston.info('CONNECTED ' + m.toUpperCase() + ' /' + routeName + r.route.path))
      })
    }
  }

  app.use(function (err, req, res, next) {
    if (err.source === 'validation') {
      res.status(400).json(err)
    } else if (err.source === 'auth') {
      res.status(403).json(err)
    } else
    // facebook error
    if (err.message === 'Failed to fetch user profile') {
      res.status(403).json('Invalid access_token')
    } else {
      res.status(500).send('Something is broken')
    }
  })

  app.get('/state', (req, res) => {
    res.end('running')
  })
} catch (error) {
  winston.error(error)
}
