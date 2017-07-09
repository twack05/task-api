module.exports = {
  async signin (req, res) {
    try {
      const email = req.body.Email
      const password = req.body.Password
      const commonAuthError = 'Authentication failed'
      const user = await req.models.user.forge({Email: email}).fetch()
      if (!user || !user.checkPassword(password)) {
        return res.status(403).send(commonAuthError)
      }
      res.json({
        ok: true,
        Token: user.get('Token')
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  },
  async signup (req, res) {
    try {
      const email = req.body.Email
      const password = req.body.Password
      const existingUser = await req.models.user.forge({Email: email}).fetch()
      if (existingUser !== null) {
        return res.status(400).json({
          Email: {
            unique: 'failed'
          }
        })
      }
      const user = req.models.user.forge({Email: email})
      user.setPassword(password)
      await user.save()
      res.json({
        ok: true,
        Token: user.get('Token')
      })
    } catch (e) {
      req.logger.error(e)
      res.status(500).json(e.message)
    }
  }
}
