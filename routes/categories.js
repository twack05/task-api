const router = require('express').Router()
const authMiddleware = require('../middleware/auth')
const validatorMiddleware = require('../middleware/validate')

module.exports = (controller) => router
  .get('/', authMiddleware, controller.getAll)
  .post('/', authMiddleware, validatorMiddleware({
    Name: 'isEmpty',
    Color: 'isEmpty',
    Position: 'isInt'
  }), controller.create)
  .put('/:id', authMiddleware, validatorMiddleware({
    Name: 'isEmpty',
    Color: 'isEmpty',
    Position: 'isInt'
  }), controller.update)
  .delete('/:id', authMiddleware, controller.delete)
