module.exports = async function (req, res, next) {
  if (!req.headers.authorization) {
    return next({
      source: 'auth',
      error: 'Header Authorization is absent'
    })
  }
// fad56909-2622-49f9-a40c-61e0650db9f0
// cbccc993-ada3-47c8-ab38-0f42088e5cce
  let token = req.headers.authorization.split('Bearer ')[1]
  if (!token) {
    return next({
      source: 'auth',
      error: 'Token is absent'
    })
  }

  const user = await req.models.user.forge({Token: token}).fetch()
  if (!user) {
    return next({
      source: 'auth',
      error: 'Token is wrong'
    })
  }
  req.user = user.toJSON()
  next()
}
