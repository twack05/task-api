module.exports = {
  async signin (req, res) {
    try {
      const email = req.body.email
      const password = req.body.password
      const commonAuthError = 'Authentication failed'
      const user = await req.models.user.forge({email: email}).fetch()
      if (!user || !user.checkPassword(password)) {
        return res.status(403).send(commonAuthError)
      }
      res.json({
        ok: true,
        token: user.get('token')
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  },
  async signup (req, res) {
    try {
      const email = req.body.email
      const password = req.body.password
      const existingUser = await req.models.user.forge({email: email}).fetch()
      if (existingUser !== null) {
        return res.status(400).json({
          email: {
            unique: 'failed'
          }
        })
      }
      const user = req.models.user.forge({email: email})
      user.setPassword(password)
      await user.save()
      res.json({
        ok: true,
        token: user.get('token')
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  }
}
