const router = require('express').Router()
const authMiddleware = require('../middleware/auth')
const validatorMiddleware = require('../middleware/validate')

module.exports = (controller) => router
  .get('/', authMiddleware, controller.getAll)
  .post('/', authMiddleware, validatorMiddleware({
    name: 'isEmpty',
    color: 'isEmpty',
    position: 'isInt'
  }), controller.create)
  .put('/:id', authMiddleware, validatorMiddleware({
    name: 'isEmpty',
    color: 'isEmpty',
    position: 'isInt'
  }), controller.update)
  .delete('/:id', authMiddleware, controller.delete)
