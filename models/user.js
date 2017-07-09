const crypto = require('crypto')
const uuid = require('uuid')

module.exports = function (bookshelf) {
  return bookshelf.Model.extend(
    {
      tableName: 'users',
      idAttribute: 'Id',
      format (attrs) {
        if (attrs.Email) {
          attrs.Email = attrs.Email.trim().toLowerCase()
        }
        return attrs
      },
      checkPassword (password) {
        return this.get('Password_hash') === generatePassword(password, this.get('salt'))
      },
      setPassword (password) {
        this.set('salt', generateSalt())
        this.set('Token', generateSalt())
        this.set('Password_hash', generatePassword(password, this.get('salt')))
      }
    }
  )
}

function generateSalt () {
  return uuid.v4()
}

function generatePassword (password, salt) {
  if (!password || !salt) throw new Error('no password')
  let h = crypto.createHash('sha512')
  h.update(password)
  h.update(salt)
  return h.digest('base64')
}
