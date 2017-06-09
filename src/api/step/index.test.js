import request from 'supertest-as-promised'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Step } from '.'

const app = () => express(routes)

let userSession, anotherSession, step

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  step = await Step.create({ user })
})

test('POST /steps 201 (user)', async () => {
  const { status, body } = await request(app())
    .post('/')
    .send({ access_token: userSession, callId: 'test', type: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.callId).toEqual('test')
  expect(body.type).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /steps 401', async () => {
  const { status } = await request(app())
    .post('/')
  expect(status).toBe(401)
})

test('GET /steps 200 (user)', async () => {
  const { status, body } = await request(app())
    .get('/')
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /steps 401', async () => {
  const { status } = await request(app())
    .get('/')
  expect(status).toBe(401)
})

test('GET /steps/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`/${step.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(step.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /steps/:id 401', async () => {
  const { status } = await request(app())
    .get(`/${step.id}`)
  expect(status).toBe(401)
})

test('GET /steps/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get('/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /steps/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`/${step.id}`)
    .send({ access_token: userSession, callId: 'test', type: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(step.id)
  expect(body.callId).toEqual('test')
  expect(body.type).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /steps/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`/${step.id}`)
    .send({ access_token: anotherSession, callId: 'test', type: 'test' })
  expect(status).toBe(401)
})

test('PUT /steps/:id 401', async () => {
  const { status } = await request(app())
    .put(`/${step.id}`)
  expect(status).toBe(401)
})

test('PUT /steps/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put('/123456789098765432123456')
    .send({ access_token: anotherSession, callId: 'test', type: 'test' })
  expect(status).toBe(404)
})

test('DELETE /steps/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`/${step.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /steps/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`/${step.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /steps/:id 401', async () => {
  const { status } = await request(app())
    .delete(`/${step.id}`)
  expect(status).toBe(401)
})

test('DELETE /steps/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete('/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
