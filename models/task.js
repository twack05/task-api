module.exports = function (bookshelf) {
  const Task = bookshelf.Model.extend(
    {
      tableName: 'tasks',
      idAttribute: 'Id',
      initialize () {
        this.on('updating', (model) => {
          model.set('lastUpdated', bookshelf.knex.raw('now()'))
        })
      }
    }
  )
  return Task
}
