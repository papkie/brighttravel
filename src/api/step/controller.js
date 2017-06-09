import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Step } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Step.create({ ...body, user })
    .then((step) => step.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Step.find(query, select, cursor)
    .populate('user')
    .then((steps) => steps.map((step) => step.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Step.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((step) => step ? step.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Step.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((step) => step ? _.merge(step, body).save() : null)
    .then((step) => step ? step.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Step.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((step) => step ? step.remove() : null)
    .then(success(res, 204))
    .catch(next)
