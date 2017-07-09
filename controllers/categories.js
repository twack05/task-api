module.exports = {
  async getAll (req, res) {
    try {
      const categories = await req.models.category.forge().where('User_id', req.user.Id).fetchAll()
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
        User_id: req.user.Id,
        Name: req.body.Name,
        Color: req.body.Color,
        Position: req.body.Position
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
      const Id = req.params.id
      const existingCategory = await req.models.category.forge({Id}).fetch()

      if (existingCategory.get('User_id') !== req.user.Id) {
        return res.status(403).send('You don\'t have access to this category')
      }

      const category = req.models.category.forge({
        Id,
        Name: req.body.Name,
        Color: req.body.Color,
        Position: req.body.Position
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
  async delete (req, res) {
    try {
      const Id = req.params.id

      const existingCategory = await req.models.category.forge({Id}).fetch()

      if (existingCategory.get('User_id') !== req.user.Id) {
        return res.status(403).send('You don\'t have access to this category')
      }

      const category = req.models.category.forge({Id})
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
