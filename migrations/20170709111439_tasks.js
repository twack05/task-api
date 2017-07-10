exports.up = function (knex, Promise) {
  return knex.schema.createTable('tasks', function (table) {
    table.increments('id').primary()
    table.integer('user_id').notNullable()
    table.integer('category_id').notNullable()
    table.string('title').notNullable()
    table.integer('amount').notNullable()
    table.boolean('completed').notNullable()
    table.specificType('days', 'text[]').notNullable()
    table.boolean('repeating').notNullable()
    table.datetime('start').notNullable()
    table.datetime('finish').notNullable()
    table.integer('reminder').notNullable()
    table.datetime('lastUpdated')
    table.datetime('timestamp').notNullable().defaultTo(knex.raw('now()'))
    table.boolean('autoTrack').notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('tasks')
}
