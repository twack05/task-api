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

describe(`Users API`, () => {
  beforeEach(() => knex.migrate.rollback()
    .then(() => knex.migrate.latest())
  )
  afterEach(() => knex.migrate.rollback())
  describe('POST /users/signup', () => {
    describe('when input data is ok', () => {
      it('should return token', (done) =>
        chai.request(server)
          .post('/users/signup')
          .send({
            email: 'test@user.com',
            password: 'testpassword'
          })
          .end((err, res) => {
            expect(err).eq(null)
            expect(res.body.ok).eq(true)
            expect(res.body.token).to.not.eq(undefined)
            done()
          })
      )
    })
    describe('when email is wrong', () => {
      it('should return the error', (done) =>
        chai.request(server)
          .post('/users/signup')
          .send({
            email: 'test@user.com@',
            password: 'testpassword'
          })
          .end((err, res) => {
            expect(err).to.not.eq(null)
            expect(res.status).eq(400)
            expect(res.body.email).to.be.deep.equal({ isEmail: 'failed' })
            done()
          })
      )
    })
    describe('when email is empty', () => {
      it('should return the error', (done) =>
        chai.request(server)
          .post('/users/signup')
          .send({
            password: 'testpassword'
          })
          .end((err, res) => {
            expect(err).to.not.eq(null)
            expect(res.status).eq(400)
            expect(res.body.email).to.be.deep.equal({ isEmail: 'failed' })
            done()
          })
      )
    })
    describe('when email already exists', () => {
      it('should return the error', (done) =>
        chai.request(server)
          .post('/users/signup')
          .send({
            email: 'test@user.com',
            password: 'testpassword'
          })
          .end(() => {
            chai.request(server)
              .post('/users/signup')
              .send({
                email: 'test@user.com',
                password: 'testpassword'
              })
              .end((err, res) => {
                expect(err).to.not.eq(null)
                expect(res.status).eq(400)
                expect(res.body.email).to.be.deep.equal({ unique: 'failed' })
                done()
              })
          })
      )
    })
    describe('when password is empty', () => {
      it('should return the error', (done) =>
        chai.request(server)
          .post('/users/signup')
          .send({
            email: 'test@user.com'
          })
          .end((err, res) => {
            expect(err).to.not.eq(null)
            expect(res.status).eq(400)
            expect(res.body.password).to.be.deep.equal({ isEmpty: 'failed' })
            done()
          })
      )
    })
  })
  describe('POST /users/signin', () => {
    describe('when input data is ok', () => {
      it('should return token', (done) =>
        chai.request(server)
          .post('/users/signup')
          .send({
            email: 'test@user.com',
            password: 'testpassword'
          })
          .end(() => {
            chai.request(server)
              .post('/users/signin')
              .send({
                email: 'test@user.com',
                password: 'testpassword'
              })
              .end((err, res) => {
                expect(err).eq(null)
                expect(res.body.ok).eq(true)
                expect(res.body.token).to.not.eq(undefined)
                done()
              })
          })
      )
    })
    describe('when email is wrong', () => {
      it('should return error', (done) =>
        chai.request(server)
          .post('/users/signup')
          .send({
            email: 'test@user.com',
            password: 'testpassword'
          })
          .end(() => {
            chai.request(server)
              .post('/users/signin')
              .send({
                email: 'test2@user.com',
                password: 'testpassword'
              })
              .end((err, res) => {
                expect(err).to.not.eq(null)
                expect(res.status).eq(403)
                expect(res.text).to.be.equal('Authentication failed')
                done()
              })
          })
      )
    })
    describe('when password is wrong', () => {
      it('should return error', (done) =>
        chai.request(server)
          .post('/users/signup')
          .send({
            email: 'test@user.com',
            password: 'testpassword'
          })
          .end(() => {
            chai.request(server)
              .post('/users/signin')
              .send({
                email: 'test@user.com',
                password: 'wrong'
              })
              .end((err, res) => {
                expect(err).to.not.eq(null)
                expect(res.status).eq(403)
                expect(res.text).to.be.equal('Authentication failed')
                done()
              })
          })
      )
    })
  })
})
