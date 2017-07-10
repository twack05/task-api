const { describe, it, beforeEach, afterEach } = require('kocha')
const chai = require('chai')
const config = require('config')
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../index')
const knex = require('knex')({
  client: 'pg',
  connection: config.get('db.connection'),
  debug: false
})

chai.use(chaiHttp)

describe(`Categories API`, () => {
  beforeEach(() => knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
  )
  afterEach(() => knex.migrate.rollback())

  describe('POST /categories', () => {
    describe('when data is ok', () => {
      it('should work without errors and return category', (done) => {
        chai.request(server)
          .post('/categories')
          .set('Authorization', `Bearer 123456789`)
          .send({
            name: 'test category',
            color: 'emerald',
            position: 1
          })
          .end((err, res) => {
            expect(err).to.be.equal(null)
            expect(res.status).to.be.equal(200)
            expect(res.body.ok).to.be.equal(true)
            expect(res.body.data).to.be.deep.equal({
              user_id: 1,
              name: 'test category',
              color: 'emerald',
              position: 1,
              id: 6
            })
            done()
          })
      })
    })
    describe('when data is bad', () => {
      it('should return error', (done) => {
        chai.request(server)
          .post('/categories')
          .set('Authorization', `Bearer 123456789`)
          .send({
            name: 'test category',
            position: 1
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(400)
            expect(res.body).to.be.deep.equal({
              color: {
                isEmpty: 'failed'
              },
              source: 'validation'
            })
            done()
          })
      })
    })
  })
  describe('GET /categories', () => {
    describe('for users 1 token', () => {
      it('should return categories created by user 1', (done) => {
        chai.request(server)
          .get('/categories')
          .set('Authorization', `Bearer 123456789`)
          .end((err, res) => {
            expect(err).to.be.equal(null)
            expect(res.status).to.be.equal(200)
            expect(res.body).to.be.deep.equal({
              'data': [
                {
                  'id': 1,
                  'user_id': 1,
                  'name': 'precreated test category 1',
                  'color': 'bluish',
                  'position': 2
                },
                {
                  'id': 2,
                  'user_id': 1,
                  'name': 'precreated test category 2',
                  'color': 'azure',
                  'position': 3
                },
                {
                  'id': 3,
                  'user_id': 1,
                  'name': 'precreated test category 3',
                  'color': 'aqua',
                  'position': 1
                }
              ]
            })
            done()
          })
      })
    })
    describe('for users 2 token', () => {
      it('should return categories created by user 1', (done) => {
        chai.request(server)
          .get('/categories')
          .set('Authorization', `Bearer 987654321`)
          .end((err, res) => {
            expect(err).to.be.equal(null)
            expect(res.status).to.be.equal(200)
            expect(res.body).to.be.deep.equal({
              'data': [
                {
                  'id': 4,
                  'user_id': 2,
                  'name': 'precreated test category 4',
                  'color': 'indigo',
                  'position': 1
                },
                {
                  'id': 5,
                  'user_id': 2,
                  'name': 'precreated test category 5',
                  'color': 'lime',
                  'position': 2
                }
              ]
            })
            done()
          })
      })
    })
  })
  describe('PUT /categories/:id', () => {
    describe('when data is ok', () => {
      it('should work without errors and return category', (done) => {
        chai.request(server)
          .put('/categories/1')
          .set('Authorization', `Bearer 123456789`)
          .send({
            name: 'updated test category',
            color: 'olive',
            position: 1
          })
          .end((err, res) => {
            expect(err).to.be.equal(null)
            expect(res.status).to.be.equal(200)
            expect(res.body.ok).to.be.equal(true)
            expect(res.body.data).to.be.deep.equal({
              user_id: 1,
              name: 'updated test category',
              color: 'olive',
              position: 1,
              id: 1
            })
            done()
          })
      })
    })
    describe('when data is bad', () => {
      it('should return error', (done) => {
        chai.request(server)
          .put('/categories/1')
          .set('Authorization', `Bearer 123456789`)
          .send({
            name: 'updated test category',
            position: 1
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(400)
            expect(res.body).to.be.deep.equal({
              color: {
                isEmpty: 'failed'
              },
              source: 'validation'
            })
            done()
          })
      })
    })
    describe('when trying to update anothers category', () => {
      it('should return error', (done) => {
        chai.request(server)
          .put('/categories/1')
          .set('Authorization', `Bearer 987654321`)
          .send({
            name: 'updated test category',
            color: 'olive',
            position: 1
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(403)
            expect(res.text).to.be.equal('You don\'t have access to this category')
            done()
          })
      })
    })
    describe('when trying to update not existing category', () => {
      it('should return error', (done) => {
        chai.request(server)
          .put('/categories/1991')
          .set('Authorization', `Bearer 987654321`)
          .send({
            name: 'updated test category',
            color: 'olive',
            position: 1
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(404)
            expect(res.text).to.be.equal('Category with id 1991 doesn\'t exist')
            done()
          })
      })
    })
  })

  describe('DELETE /categories/:id', () => {
    describe('when data is ok', () => {
      it('should work without errors and delete category with id 1', (done) => {
        chai.request(server)
          .delete('/categories/1')
          .set('Authorization', `Bearer 123456789`)
          .end((err, res) => {
            expect(err).to.be.equal(null)
            expect(res.status).to.be.equal(200)
            expect(res.body.ok).to.be.equal(true)
            chai.request(server)
              .get('/categories')
              .set('Authorization', `Bearer 123456789`)
              .end((err, res) => {
                expect(err).to.be.equal(null)
                expect(res.status).to.be.equal(200)
                expect(res.body).to.be.deep.equal({
                  'data': [
                    {
                      'id': 2,
                      'user_id': 1,
                      'name': 'precreated test category 2',
                      'color': 'azure',
                      'position': 3
                    },
                    {
                      'id': 3,
                      'user_id': 1,
                      'name': 'precreated test category 3',
                      'color': 'aqua',
                      'position': 1
                    }
                  ]
                })
                done()
              })
          })
      })
    })
    describe('when trying to delete not existing category', () => {
      it('should return error', (done) => {
        chai.request(server)
          .delete('/categories/42')
          .set('Authorization', `Bearer 987654321`)
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(404)
            expect(res.text).to.be.equal('Category with id 42 doesn\'t exist')
            done()
          })
      })
    })
    describe('when trying to delete anothers category', () => {
      it('should return error', (done) => {
        chai.request(server)
          .delete('/categories/1')
          .set('Authorization', `Bearer 987654321`)
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(403)
            expect(res.text).to.be.equal('You don\'t have access to this category')
            chai.request(server)
              .get('/categories')
              .set('Authorization', `Bearer 123456789`)
              .end((err, res) => {
                expect(err).to.be.equal(null)
                expect(res.status).to.be.equal(200)
                expect(res.body).to.be.deep.equal({
                  'data': [
                    {
                      'id': 1,
                      'user_id': 1,
                      'name': 'precreated test category 1',
                      'color': 'bluish',
                      'position': 2
                    },
                    {
                      'id': 2,
                      'user_id': 1,
                      'name': 'precreated test category 2',
                      'color': 'azure',
                      'position': 3
                    },
                    {
                      'id': 3,
                      'user_id': 1,
                      'name': 'precreated test category 3',
                      'color': 'aqua',
                      'position': 1
                    }
                  ]
                })
                done()
              })
          })
      })
    })
  })
})
