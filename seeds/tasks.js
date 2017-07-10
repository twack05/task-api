
exports.seed = function (knex) {
  return knex('tasks').del()
    .then(function () {
      return knex('tasks').insert([
        {
          title: 'precreated test task 1',
          user_id: 1,
          category_id: 1,
          completed: false,
          days: ['Mon', 'Wed'],
          repeating: true,
          start: '2017-05-13',
          finish: '2017-05-15',
          reminder: 10,
          autoTrack: false,
          amount: 2
        },
        {
          title: 'precreated test task 2',
          user_id: 1,
          category_id: 2,
          completed: false,
          days: ['Mon', 'Wed'],
          repeating: true,
          start: '2017-05-13',
          finish: '2017-05-15',
          reminder: 10,
          autoTrack: false,
          amount: 2
        },
        {
          title: 'precreated test task 3',
          user_id: 2,
          category_id: 5,
          completed: false,
          days: ['Mon', 'Wed'],
          repeating: true,
          start: '2017-05-13',
          finish: '2017-05-15',
          reminder: 10,
          autoTrack: false,
          amount: 2
        }
      ])
    })
}
