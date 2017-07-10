const crypto = require('crypto')
const uuid = require('uuid')

module.exports = function (bookshelf) {
  const User = bookshelf.Model.extend(
    {
      tableName: 'users',
      idAttribute: 'id',
      format (attrs) {
        if (attrs.email) {
          attrs.email = attrs.email.trim().toLowerCase()
        }
        return attrs
      },
      checkPassword (password) {
        return this.get('password_hash') === generatePassword(password, this.get('salt'))
      },
      setPassword (password) {
        this.set('salt', generateSalt())
        this.set('token', generateSalt())
        this.set('password_hash', generatePassword(password, this.get('salt')))
      }
    }, {
      async findOrCreateByFB (profile) {
        const existing = await new User({facebook_id: profile.id}).fetch()
        if (existing !== null) return existing
        const user = new User({
          facebook_id: profile.id,
          email: (profile.emails && profile.emails.length) ? profile.emails.pop().value : '',
          token: generateSalt()
        })
        await user.save()
        return user
      }
    }
  )
  return User
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
