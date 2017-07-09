const config = require('config')

module.exports = {
  development: {
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
  },
  test: {
    client: 'pg',
    ssl: true,
    connection: config.get('db.connection'),
    seeds: {
      directory: `${__dirname}/seeds/test`
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
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
