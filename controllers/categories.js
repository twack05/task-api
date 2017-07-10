module.exports = {
  async getAll (req, res) {
    try {
      const categories = await req.models.category.forge().where('user_id', req.user.id).fetchAll()
      res.json({
        data: categories.toJSON()
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  },
  async create (req, res) {
    try {
      const category = req.models.category.forge({
        user_id: req.user.id,
        name: req.body.name,
        color: req.body.color,
        position: req.body.position
      })
      await category.save()
      res.json({
        ok: true,
        data: category.toJSON()
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  },
  async update (req, res) {
    try {
      const id = Number(req.params.id)
      const existingCategory = await req.models.category.forge({id}).fetch()
      if (existingCategory === null) {
        return res.status(404).send(`Category with id ${id} doesn't exist`)
      }
      if (existingCategory.get('user_id') !== req.user.id) {
        return res.status(403).send('You don\'t have access to this category')
      }
      const category = req.models.category.forge({
        id,
        name: req.body.name,
        color: req.body.color,
        user_id: req.user.id,
        position: req.body.position
      })
      await category.save()
      await category.fetch()
      res.json({
        ok: true,
        data: category.toJSON()
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  },
  async delete (req, res) {
    try {
      const id = req.params.id
      const category = await req.models.category.forge({id}).fetch()
      if (category === null) {
        return res.status(404).send(`Category with id ${id} doesn't exist`)
      }
      if (category.get('user_id') !== req.user.id) {
        return res.status(403).send('You don\'t have access to this category')
      }
      await category.destroy()
      res.json({
        ok: true
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  }
}
