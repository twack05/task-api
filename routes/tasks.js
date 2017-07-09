const router = require('express').Router()
const authMiddleware = require('../middleware/auth')
const validatorMiddleware = require('../middleware/validate')

module.exports = (controller) => router
  .get('/', authMiddleware, controller.getAll)
  .post('/', authMiddleware, validatorMiddleware({
    Category_id: 'isInt',
    Title: 'isEmpty',
    amount: 'isInt',
    Completed: 'isBoolean',
    days: 'isEmpty',
    repeating: 'isBoolean',
    Start: 'isISO8601',
    Finish: 'isISO8601',
    reminder: 'isInt',
    autoTrack: 'isBoolean'
  }), controller.create)
  .put('/:id', authMiddleware, validatorMiddleware({
    Category_id: 'isEmpty',
    Title: 'isEmpty',
    amount: 'isInt',
    Completed: 'isEmpty',
    days: 'isEmpty',
    repeating: 'isEmpty',
    Start: 'isEmpty',
    Finish: 'isEmpty',
    reminder: 'isEmpty',
    autoTrack: 'isEmpty'
  }), controller.update)
  .delete('/:id', authMiddleware, controller.delete)
