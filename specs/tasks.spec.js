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

describe(`Tasks API`, () => {
  beforeEach(() => knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
  )
  afterEach(() => knex.migrate.rollback())

  describe('POST /tasks', () => {
    describe('when data is ok', () => {
      it('should work without errors and return task', (done) => {
        chai.request(server)
          .post('/tasks')
          .set('Authorization', `Bearer 123456789`)
          .send({
            title: 'test task 1',
            category_id: 1,
            completed: false,
            days: ['Tue', 'Sat'],
            repeating: true,
            start: '2017-05-14',
            finish: '2017-05-16',
            reminder: 10,
            autoTrack: false,
            amount: 2
          })
          .end((err, res) => {
            expect(err).to.be.equal(null)
            expect(res.status).to.be.equal(200)
            expect(res.body.ok).to.be.equal(true)
            expect(res.body.data.timestamp).to.not.be.equal(undefined)
            delete res.body.data.timestamp
            expect(res.body.data).to.be.deep.equal({
              user_id: 1,
              category_id: 1,
              title: 'test task 1',
              amount: 2,
              completed: false,
              days: [ 'Tue', 'Sat' ],
              repeating: true,
              start: '2017-05-13T21:00:00.000Z',
              finish: '2017-05-15T21:00:00.000Z',
              reminder: 10,
              autoTrack: false,
              id: 4,
              lastUpdated: null
            })
            done()
          })
      })
    })
    describe('when data is bad', () => {
      it('should return error', (done) => {
        chai.request(server)
          .post('/tasks')
          .set('Authorization', `Bearer 123456789`)
          .send({
            category_id: 1,
            completed: false,
            days: ['Tue', 'Sat'],
            repeating: true,
            start: '2017-05-14',
            finish: '2017-05-16',
            reminder: 10,
            autoTrack: false,
            amount: 2
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(400)
            expect(res.body).to.be.deep.equal({
              title: {
                isEmpty: 'failed'
              },
              source: 'validation'
            })
            done()
          })
      })
    })
    describe('when trying to create a task in other users category', () => {
      it('should return error', (done) => {
        chai.request(server)
          .post('/tasks')
          .set('Authorization', `Bearer 123456789`)
          .send({
            category_id: 4,
            title: 'test task 1',
            completed: false,
            days: ['Tue', 'Sat'],
            repeating: true,
            start: '2017-05-14',
            finish: '2017-05-16',
            reminder: 10,
            autoTrack: false,
            amount: 2
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(403)
            expect(res.text).to.be.equal('You don\'t have access to this category')
            done()
          })
      })
    })
    describe('when trying to create a task in not existing category', () => {
      it('should return error', (done) => {
        chai.request(server)
          .post('/tasks')
          .set('Authorization', `Bearer 123456789`)
          .send({
            category_id: 9999,
            title: 'test task 1',
            completed: false,
            days: ['Tue', 'Sat'],
            repeating: true,
            start: '2017-05-14',
            finish: '2017-05-16',
            reminder: 10,
            autoTrack: false,
            amount: 2
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(400)
            expect(res.text).to.be.equal('Category with id 9999 doesn\'t exist')
            done()
          })
      })
    })
  })

  describe('GET /tasks', () => {
    describe('for users 1 token', () => {
      it('should return tasks created by user 1', (done) => {
        chai.request(server)
          .get('/tasks')
          .set('Authorization', `Bearer 123456789`)
          .end((err, res) => {
            expect(err).to.be.equal(null)
            expect(res.status).to.be.equal(200)
            res.body.data.map((task) => {
              expect(task.timestamp).to.not.be.equal(undefined)
              delete task.timestamp
            })
            expect(res.body).to.be.deep.equal({
              'data': [
                {
                  'id': 1,
                  'user_id': 1,
                  'category_id': 1,
                  'title': 'precreated test task 1',
                  'amount': 2,
                  'completed': false,
                  'days': [
                    'Mon',
                    'Wed'
                  ],
                  'repeating': true,
                  'start': '2017-05-12T21:00:00.000Z',
                  'finish': '2017-05-14T21:00:00.000Z',
                  'reminder': 10,
                  'lastUpdated': null,
                  'autoTrack': false
                },
                {
                  'id': 2,
                  'user_id': 1,
                  'category_id': 2,
                  'title': 'precreated test task 2',
                  'amount': 2,
                  'completed': false,
                  'days': [
                    'Mon',
                    'Wed'
                  ],
                  'repeating': true,
                  'start': '2017-05-12T21:00:00.000Z',
                  'finish': '2017-05-14T21:00:00.000Z',
                  'reminder': 10,
                  'lastUpdated': null,
                  'autoTrack': false
                }
              ]
            })
            done()
          })
      })
    })

    describe('for users 2 token', () => {
      it('should return tasks created by user 2', (done) => {
        chai.request(server)
          .get('/tasks')
          .set('Authorization', `Bearer 987654321`)
          .end((err, res) => {
            expect(err).to.be.equal(null)
            expect(res.status).to.be.equal(200)
            res.body.data.map((task) => {
              expect(task.timestamp).to.not.be.equal(undefined)
              delete task.timestamp
            })
            expect(res.body).to.be.deep.equal({
              'data': [
                {
                  'id': 3,
                  'user_id': 2,
                  'category_id': 5,
                  'title': 'precreated test task 3',
                  'amount': 2,
                  'completed': false,
                  'days': [
                    'Mon',
                    'Wed'
                  ],
                  'repeating': true,
                  'start': '2017-05-12T21:00:00.000Z',
                  'finish': '2017-05-14T21:00:00.000Z',
                  'reminder': 10,
                  'lastUpdated': null,
                  'autoTrack': false
                }
              ]
            })
            done()
          })
      })
    })
  })

  describe('PUT /tasks/:id', () => {
    describe('when data is ok', () => {
      it('should work without errors and return category', (done) => {
        chai.request(server)
          .put('/tasks/1')
          .set('Authorization', `Bearer 123456789`)
          .send({
            title: 'updatedtest task 1',
            category_id: 1,
            completed: false,
            days: ['Tue', 'Sat', 'Wed'],
            repeating: true,
            start: '2017-05-14',
            finish: '2017-05-19',
            reminder: 12,
            autoTrack: false,
            amount: 2
          })
          .end((err, res) => {
            expect(err).to.be.equal(null)
            expect(res.status).to.be.equal(200)
            expect(res.body.ok).to.be.equal(true)
            expect(res.body.data.timestamp).to.not.be.equal(undefined)
            delete res.body.data.timestamp
            expect(res.body.data.lastUpdated).to.not.be.equal(null)
            delete res.body.data.lastUpdated
            expect(res.body.data).to.be.deep.equal({
              'id': 1,
              'user_id': 1,
              'category_id': 1,
              'title': 'updatedtest task 1',
              'amount': 2,
              'completed': false,
              'days': [
                'Tue',
                'Sat',
                'Wed'
              ],
              'repeating': true,
              'start': '2017-05-13T21:00:00.000Z',
              'finish': '2017-05-18T21:00:00.000Z',
              'reminder': 12,
              'autoTrack': false
            })
            done()
          })
      })
    })
    describe('when data is bad', () => {
      it('should return error', (done) => {
        chai.request(server)
          .put('/tasks/1')
          .set('Authorization', `Bearer 123456789`)
          .send({
            category_id: 1,
            completed: false,
            days: ['Tue', 'Sat', 'Wed'],
            repeating: true,
            start: '2017-05-14',
            finish: '2017-05-19',
            reminder: 12,
            autoTrack: false,
            amount: 2
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(400)
            expect(res.body).to.be.deep.equal({
              title: {
                isEmpty: 'failed'
              },
              source: 'validation'
            })
            done()
          })
      })
    })
    describe('when trying to set not existing category', () => {
      it('should return error', (done) => {
        chai.request(server)
          .put('/tasks/3')
          .set('Authorization', `Bearer 987654321`)
          .send({
            title: 'updatedtest task 1',
            category_id: 9999,
            completed: false,
            days: ['Tue', 'Sat', 'Wed'],
            repeating: true,
            start: '2017-05-14',
            finish: '2017-05-19',
            reminder: 12,
            autoTrack: false,
            amount: 2
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(400)
            expect(res.text).to.be.equal('Category with id 9999 doesn\'t exist')
            done()
          })
      })
    })
    describe('when trying to set anothers category to your task', () => {
      it('should return error', (done) => {
        chai.request(server)
          .put('/tasks/3')
          .set('Authorization', `Bearer 987654321`)
          .send({
            title: 'updatedtest task 1',
            category_id: 1,
            completed: false,
            days: ['Tue', 'Sat', 'Wed'],
            repeating: true,
            start: '2017-05-14',
            finish: '2017-05-19',
            reminder: 12,
            autoTrack: false,
            amount: 2
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(403)
            expect(res.text).to.be.equal('You don\'t have access to this category')
            done()
          })
      })
    })
    describe('when trying to update anothers task', () => {
      it('should return error', (done) => {
        chai.request(server)
          .put('/tasks/1')
          .set('Authorization', `Bearer 987654321`)
          .send({
            title: 'updatedtest task 1',
            category_id: 5,
            completed: false,
            days: ['Tue', 'Sat', 'Wed'],
            repeating: true,
            start: '2017-05-14',
            finish: '2017-05-19',
            reminder: 12,
            autoTrack: false,
            amount: 2
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(403)
            expect(res.text).to.be.equal('You don\'t have access to this task')
            done()
          })
      })
    })
    describe('when trying to update not existing task', () => {
      it('should return error', (done) => {
        chai.request(server)
          .put('/tasks/9999')
          .set('Authorization', `Bearer 987654321`)
          .send({
            title: 'updatedtest task 1',
            category_id: 5,
            completed: false,
            days: ['Tue', 'Sat', 'Wed'],
            repeating: true,
            start: '2017-05-14',
            finish: '2017-05-19',
            reminder: 12,
            autoTrack: false,
            amount: 2
          })
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(404)
            expect(res.text).to.be.equal('Task with id 9999 doesn\'t exist')
            done()
          })
      })
    })
  })

  describe('DELETE /tasks/:id', () => {
    describe('when data is ok', () => {
      it('should work without errors and delete task with id 1', (done) => {
        chai.request(server)
          .delete('/tasks/1')
          .set('Authorization', `Bearer 123456789`)
          .end((err, res) => {
            expect(err).to.be.equal(null)
            expect(res.status).to.be.equal(200)
            expect(res.body.ok).to.be.equal(true)
            chai.request(server)
              .get('/tasks')
              .set('Authorization', `Bearer 123456789`)
              .end((err, res) => {
                expect(err).to.be.equal(null)
                expect(res.status).to.be.equal(200)
                res.body.data.map((task) => {
                  delete task.timestamp
                  delete task.lastUpdated
                })
                expect(res.body).to.be.deep.equal({
                  'data': [{
                    id: 2,
                    user_id: 1,
                    category_id: 2,
                    title: 'precreated test task 2',
                    amount: 2,
                    completed: false,
                    days: [ 'Mon', 'Wed' ],
                    repeating: true,
                    start: '2017-05-12T21:00:00.000Z',
                    finish: '2017-05-14T21:00:00.000Z',
                    reminder: 10,
                    autoTrack: false
                  }]
                })
                done()
              })
          })
      })
    })
    describe('when trying to delete not existing task', () => {
      it('should return error', (done) => {
        chai.request(server)
          .delete('/tasks/9999')
          .set('Authorization', `Bearer 987654321`)
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(404)
            expect(res.text).to.be.equal('Task with id 9999 doesn\'t exist')
            done()
          })
      })
    })
    describe('when trying to delete anothers task', () => {
      it('should return error', (done) => {
        chai.request(server)
          .delete('/tasks/1')
          .set('Authorization', `Bearer 987654321`)
          .end((err, res) => {
            expect(err).to.not.be.equal(null)
            expect(res.status).to.be.equal(403)
            expect(res.text).to.be.equal('You don\'t have access to this task')
            chai.request(server)
              .get('/tasks')
              .set('Authorization', `Bearer 123456789`)
              .end((err, res) => {
                expect(err).to.be.equal(null)
                expect(res.status).to.be.equal(200)
                res.body.data.map((task) => {
                  expect(task.timestamp).to.not.be.equal(undefined)
                  delete task.timestamp
                })
                expect(res.body).to.be.deep.equal({
                  'data': [
                    {
                      'id': 1,
                      'user_id': 1,
                      'category_id': 1,
                      'title': 'precreated test task 1',
                      'amount': 2,
                      'completed': false,
                      'days': [
                        'Mon',
                        'Wed'
                      ],
                      'repeating': true,
                      'start': '2017-05-12T21:00:00.000Z',
                      'finish': '2017-05-14T21:00:00.000Z',
                      'reminder': 10,
                      'lastUpdated': null,
                      'autoTrack': false
                    },
                    {
                      'id': 2,
                      'user_id': 1,
                      'category_id': 2,
                      'title': 'precreated test task 2',
                      'amount': 2,
                      'completed': false,
                      'days': [
                        'Mon',
                        'Wed'
                      ],
                      'repeating': true,
                      'start': '2017-05-12T21:00:00.000Z',
                      'finish': '2017-05-14T21:00:00.000Z',
                      'reminder': 10,
                      'lastUpdated': null,
                      'autoTrack': false
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
