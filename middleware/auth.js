module.exports = async function (req, res, next) {
  if (!req.headers.authorization) {
    return next({
      source: 'auth',
      error: 'Header Authorization is absent'
    })
  }
  let token = req.headers.authorization.split('Bearer ')[1]
  if (!token) {
    return next({
      source: 'auth',
      error: 'Token is absent'
    })
  }
  const user = await req.models.user.forge({token}).fetch()
  if (!user) {
    return next({
      source: 'auth',
      error: 'Token is wrong'
    })
  }
  req.user = user.toJSON()
  next()
}
