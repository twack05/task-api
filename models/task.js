module.exports = function (bookshelf) {
  const Task = bookshelf.Model.extend(
    {
      tableName: 'tasks'
    }
  )
  return Task
}
