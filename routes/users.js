let router = require('express').Router()
const validatorMiddleware = require('../middleware/validate')

module.exports = (controller) => router
  .post('/signin', controller.signin)
  .post('/signup', validatorMiddleware({
    Email: 'isEmail',
    Password: 'isEmpty'
  }), controller.signup)
