module.exports = function (bookshelf) {
  const Category = bookshelf.Model.extend(
    {
      tableName: 'categories',
      idAttribute: 'Id'
    }
  )
  return Category
}
