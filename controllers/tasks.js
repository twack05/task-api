const moment = require('moment')

module.exports = {
  async getAll (req, res) {
    try {
      const tasks = await req.models.tasks.forge().where('User_id', req.user.Id).fetchAll()
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
      const category = await req.models.category.forge({Id: req.body.Category_id}).fetch()

      if (category.get('User_id') !== req.user.Id) {
        return res.status(403).send('You don\'t have access to this category')
      }

      if (moment(req.body.Start).isAfter(moment(req.body.Finish))) {
        return res.status(400).json({
          Start: {
            beforeFinish: 'failed'
          }
        })
      }
      const task = req.models.task.forge({
        User_id: req.user.Id,
        Category_id: req.body.Category_id,
        Title: req.body.Title,
        amount: req.body.amount,
        Completed: req.body.Completed,
        days: req.body.days,
        repeating: req.body.repeating,
        Start: req.body.Start,
        Finish: req.body.Finish,
        reminder: req.body.reminder,
        autoTrack: req.body.autoTrack
      })
      await task.save()
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
      const existingTask = await req.models.task.forge({Id: req.body.Category_id}).fetch()
      if (existingTask.get('User_id') !== req.user.Id) {
        return res.status(403).send('You don\'t have access to this task')
      }

      if (moment(req.body.Start).isAfter(moment(req.body.Finish))) {
        return res.status(400).json({
          Start: {
            beforeFinish: 'failed'
          }
        })
      }
      const task = req.models.task.forge({
        User_id: req.user.Id,
        Category_id: req.body.Category_id,
        Title: req.body.Title,
        amount: req.body.amount,
        Completed: req.body.Completed,
        days: req.body.days,
        repeating: req.body.repeating,
        Start: req.body.Start,
        Finish: req.body.Finish,
        reminder: req.body.reminder,
        autoTrack: req.body.autoTrack
      })
      await task.save()
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
      const Id = req.params.id
      const existingTask = await req.models.task.forge({Id: req.body.Category_id}).fetch()
      if (existingTask.get('User_id') !== req.user.Id) {
        return res.status(403).send('You don\'t have access to this task')
      }
      const task = req.models.task.forge({Id})
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
