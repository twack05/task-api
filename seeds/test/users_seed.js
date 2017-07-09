
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          Email: 'user1@localhost.loc',
          Password_hash: 'fsadfasfasfd',
          salt: '123123',
          Token: '123456789'
        }
      ])
    })
}
