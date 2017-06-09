import { Step } from '.'
import { User } from '../user'

let user, step

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  step = await Step.create({ user, callId: 'test', type: 'travel' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = step.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(step.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.callId).toBe(step.callId)
    expect(view.type).toBe(step.type)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = step.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(step.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.callId).toBe(step.callId)
    expect(view.type).toBe(step.type)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
