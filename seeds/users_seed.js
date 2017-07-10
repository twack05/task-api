
exports.seed = function (knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {
          email: 'user1@localhost.loc',
          password_hash: 'fsadfasfasfd',
          salt: '123123',
          token: '123456789'
        },
        {
          email: 'user2@localhost.loc',
          password_hash: 'fsadfasfasfd',
          salt: '123123',
          token: '987654321'
        }
      ])
    })
}
