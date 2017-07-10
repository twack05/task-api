const config = require('config')

module.exports = {
  development: {
    client: 'postgresql',
    connection: config.get('db.connection'),
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  test: {
    client: 'pg',
    connection: config.get('db.connection')
  },
  production: {
    client: 'postgresql',
    connection: config.get('db.connection'),
    pool: {
      min: 2,
      max: 10
    },
    ssl: true,
    migrations: {
      tableName: 'knex_migrations'
    }
  }

}
