import { Call } from '.'
import { User } from '../user'

let user, call

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  call = await Call.create({ user, currentStepId: 'test', status: 'init' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = call.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(call.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.currentStepId).toBe(call.currentStepId)
    expect(view.status).toBe(call.status)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = call.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(call.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.currentStepId).toBe(call.currentStepId)
    expect(view.status).toBe(call.status)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
