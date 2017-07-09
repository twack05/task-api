const validator = require('validator')

module.exports = function (rules) {
  return function (req, res, next) {
    let result = {}
    for (let field in rules) {
      let checks = rules[field]
      if (req.body[field] === undefined || (!validator[checks](String(req.body[field])) && checks !== 'isEmpty')) {
        result[field] = {}
        result[field][checks] = 'failed'
      }
    }

    if (Object.keys(result).length > 0) {
      result.source = 'validation'
      next(result)
    } else {
      next()
    }
  }
}
