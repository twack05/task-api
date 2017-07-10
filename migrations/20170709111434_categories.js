exports.up = function (knex, Promise) {
  return knex.schema.createTable('categories', function (table) {
    table.increments('id').primary()
    table.integer('user_id').notNullable()
    table.string('name').notNullable()
    table.string('color').notNullable()
    table.integer('position').notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('categories')
}
