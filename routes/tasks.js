const router = require('express').Router()
const authMiddleware = require('../middleware/auth')
const validatorMiddleware = require('../middleware/validate')

module.exports = (controller) => router
  .get('/', authMiddleware, controller.getAll)
  .post('/', authMiddleware, validatorMiddleware({
    category_id: 'isInt',
    title: 'isEmpty',
    amount: 'isInt',
    completed: 'isBoolean',
    days: 'isEmpty',
    repeating: 'isBoolean',
    start: 'isISO8601',
    finish: 'isISO8601',
    reminder: 'isInt',
    autoTrack: 'isBoolean'
  }), controller.create)
  .put('/:id', authMiddleware, validatorMiddleware({
    category_id: 'isEmpty',
    title: 'isEmpty',
    amount: 'isInt',
    completed: 'isEmpty',
    days: 'isEmpty',
    repeating: 'isEmpty',
    start: 'isEmpty',
    finish: 'isEmpty',
    reminder: 'isEmpty',
    autoTrack: 'isEmpty'
  }), controller.update)
  .delete('/:id', authMiddleware, controller.delete)
