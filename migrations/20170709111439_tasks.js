exports.up = function (knex, Promise) {
  return knex.schema.createTable('tasks', function (table) {
    table.increments('Id').primary()
    table.integer('User_id').notNullable()
    table.integer('Category_id').notNullable()
    table.string('Title').notNullable()
    table.integer('amount').notNullable()
    table.boolean('Completed').notNullable()
    table.specificType('days', 'text[]').notNullable()
    table.boolean('repeating').notNullable()
    table.datetime('Start').notNullable()
    table.datetime('Finish').notNullable()
    table.integer('reminder').notNullable()
    table.datetime('lastUpdated')
    table.datetime('Timestamp').notNullable().defaultTo(knex.raw('now()'))
    table.boolean('autoTrack').notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('tasks')
}
