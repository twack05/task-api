const moment = require('moment')

module.exports = {
  async getAll (req, res) {
    try {
      const tasks = await req.models.task.forge().where('user_id', req.user.id).fetchAll()
      res.json({
        data: tasks.toJSON()
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  },
  async create (req, res) {
    try {
      const category = await req.models.category.forge({id: req.body.category_id}).fetch()
      if (category === null) {
        return res.status(400).send(`Category with id ${req.body.category_id} doesn't exist`)
      }
      if (category.get('user_id') !== req.user.id) {
        return res.status(403).send('You don\'t have access to this category')
      }

      if (moment(req.body.start).isAfter(moment(req.body.finish))) {
        return res.status(400).json({
          start: {
            beforeFinish: 'failed'
          }
        })
      }
      const task = req.models.task.forge({
        user_id: req.user.id,
        category_id: req.body.category_id,
        title: req.body.title,
        amount: req.body.amount,
        completed: req.body.completed,
        days: req.body.days,
        repeating: req.body.repeating,
        start: req.body.start,
        finish: req.body.finish,
        reminder: req.body.reminder,
        autoTrack: req.body.autoTrack
      })
      await task.save()
      await task.fetch()
      res.json({
        ok: true,
        data: task.toJSON()
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  },
  async update (req, res) {
    try {
      const id = req.params.id
      const existingTask = await req.models.task.forge({id}).fetch()
      if (existingTask === null) {
        return res.status(404).send(`Task with id ${id} doesn't exist`)
      }
      if (existingTask.get('user_id') !== req.user.id) {
        return res.status(403).send('You don\'t have access to this task')
      }
      const category = await req.models.category.forge({id: req.body.category_id}).fetch()
      if (category === null) {
        return res.status(400).send(`Category with id ${req.body.category_id} doesn't exist`)
      }
      if (category.get('user_id') !== req.user.id) {
        return res.status(403).send('You don\'t have access to this category')
      }
      if (moment(req.body.start).isAfter(moment(req.body.finish))) {
        return res.status(400).json({
          start: {
            beforeFinish: 'failed'
          }
        })
      }
      const task = req.models.task.forge({
        id,
        user_id: req.user.id,
        category_id: req.body.category_id,
        title: req.body.title,
        amount: req.body.amount,
        completed: req.body.completed,
        days: req.body.days,
        repeating: req.body.repeating,
        start: req.body.start,
        finish: req.body.finish,
        reminder: req.body.reminder,
        lastUpdated: moment().toISOString(),
        autoTrack: req.body.autoTrack
      })
      await task.save()
      await task.fetch()
      res.json({
        ok: true,
        data: task.toJSON()
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  },
  async delete (req, res) {
    try {
      const id = req.params.id
      const task = await req.models.task.forge({id}).fetch()
      if (task === null) {
        return res.status(404).send(`Task with id ${id} doesn't exist`)
      }
      if (task.get('user_id') !== req.user.id) {
        return res.status(403).send('You don\'t have access to this task')
      }
      await task.destroy()
      res.json({
        ok: true
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  }
}
