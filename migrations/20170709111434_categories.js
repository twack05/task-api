exports.up = function (knex, Promise) {
  return knex.schema.createTable('categories', function (table) {
    table.increments('Id').primary()
    table.integer('User_id').notNullable()
    table.string('Name').notNullable()
    table.string('Color').notNullable()
    table.integer('Position').notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('categories')
}
