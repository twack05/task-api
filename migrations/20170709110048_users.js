exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary()
    table.string('email').unique()
    table.string('password_hash')
    table.string('salt')
    table.string('facebook_id')
    table.string('token').notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users')
}
