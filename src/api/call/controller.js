import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Call } from '.'
import { Step } from '../step'

export const create = ({ user, bodymen: { body } }, res, next) => {
  Call.create({ ...body, user })
    .then(call => {
      const steps = body.steps.map((step, index) => Step.create({
        location: step.map(num => parseFloat(num)),
        callId: call._id,
        type: 'unknown',
        user: user._id,
        order: index
      }))
      return Promise.all(steps).then(() => call)
    })
    .then((call) => call.view(true))
    .then(success(res, 201))
    .catch(next)
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Call.find(query, select, cursor)
    .populate('user')
    .then((calls) => calls.map((call) => call.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Call.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((call) => call ? call.view() : null)
    .then(success(res))
    .catch(next)

export const showSteps = ({ params }, res, next) =>
  Step.find({callId: params.id})
    .then(notFound(res))
    .then((steps) => steps.map((step) => step.view()))
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Call.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((call) => call ? _.merge(call, body).save() : null)
    .then((call) => call ? call.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Call.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((call) => call ? call.remove() : null)
    .then(success(res, 204))
    .catch(next)

export const nextStep = ({ user, params }, res, next) => {
  Call.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((call) => {
      return call ? _.merge(call, {
        status: call.status === 'waiting' ? 'withofficer' : 'traveling'
      }).save() : null
    })
    .then((call) => call ? call.view(true) : null)
    .then(success(res))
    .catch(next)
}

export const accept = ({ user, params }, res, next) => {
  Call.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((call) => call ? _.merge(call, {
      status: 'traveling'
    }).save() : null)
    .then((call) => call ? call.view(true) : null)
    .then(success(res))
    .catch(next)
}
