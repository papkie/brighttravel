import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Call } from '.'

const app = () => express(routes)

let userSession, anotherSession, call

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  call = await Call.create({ user })
})

test('POST /calls 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, userId: 'test', currentStepId: 'test', status: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.userId).toEqual('test')
  expect(body.currentStepId).toEqual('test')
  expect(body.status).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /calls 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /calls 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /calls 401', async () => {
  const { status } = await request(app())
    .get('/')
  expect(status).toBe(401)
})

test('GET /calls/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/${call.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(call.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /calls/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${call.id}`)
  expect(status).toBe(401)
})

test('GET /calls/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /calls/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${call.id}`)
    .send({ access_token: userSession, userId: 'test', currentStepId: 'test', status: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(call.id)
  expect(body.userId).toEqual('test')
  expect(body.currentStepId).toEqual('test')
  expect(body.status).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /calls/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${call.id}`)
    .send({ access_token: anotherSession, userId: 'test', currentStepId: 'test', status: 'test' })
  expect(status).toBe(401)
})

test('PUT /calls/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${call.id}`)
  expect(status).toBe(401)
})

test('PUT /calls/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, userId: 'test', currentStepId: 'test', status: 'test' })
  expect(status).toBe(404)
})

test('DELETE /calls/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${call.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /calls/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${call.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /calls/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${call.id}`)
  expect(status).toBe(401)
})

test('DELETE /calls/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
