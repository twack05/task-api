
exports.seed = function (knex) {
  return knex('categories').del()
    .then(function () {
      return knex('categories').insert([
        {
          name: 'precreated test category 1',
          color: 'bluish',
          user_id: 1,
          position: 2
        },
        {
          name: 'precreated test category 2',
          color: 'azure',
          user_id: 1,
          position: 3
        },
        {
          name: 'precreated test category 3',
          color: 'aqua',
          user_id: 1,
          position: 1
        },
        {
          name: 'precreated test category 4',
          color: 'indigo',
          user_id: 2,
          position: 1
        },
        {
          name: 'precreated test category 5',
          color: 'lime',
          user_id: 2,
          position: 2
        }
      ])
    })
}
