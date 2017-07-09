exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments('Id').primary()
    table.string('Email').unique()
    table.string('Password_hash')
    table.string('salt').notNullable()
    table.string('Facebook_id')
    table.string('Token').notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users')
}
