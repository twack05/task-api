module.exports = function (bookshelf) {
  const Category = bookshelf.Model.extend(
    {
      tableName: 'categories'
    }
  )
  return Category
}
