import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { User } from '.'
import { Call } from '../call'
import { Step } from '../step'
import { sendPush } from '../../services/push/'
import haversine from 'haversine'

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  User.find(query, select, cursor)
    .then((users) => users.map((user) => user.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.view() : null)
    .then(success(res))
    .catch(next)

export const showMe = ({ user }, res) =>
  res.json(user.view(true))

export const create = ({ bodymen: { body } }, res, next) =>
  User.create(body)
    .then((user) => user.view(true))
    .then(success(res, 201))
    .catch((err) => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'email',
          message: 'email already registered'
        })
      } else {
        next(err)
      }
    })

const checkIfInRange = (user) => {
  Call.findOne({
    user: user._id,
    status: 'traveling'
  })
  .sort({
    createdAt: -1
  })
  .then(call => {
    return Step.find({callId: call._id})
  })
  .then(steps => {
    const lastStep = steps.slice(-1)[0]
    if (lastStep) {
      const [longitude, latitude] = lastStep.location
      const distance = haversine({latitude, longitude}, {
        latitude: user.location[1],
        longitude: user.location[0]
      })
      if (distance < 5) {
        console.log('finished', lastStep, distance)
        sendPush('7e213cc7b830b611a9e0cd17ff80f8f3030464a357d799276c6e8aa3b9b2d9b2', 'Osoba dotarła bezpiecznie')
        return Call.update({_id: lastStep.callId}, {$set: {status: 'finished'}}).catch(console.error)
      }
    }
    steps.forEach(step => {
      const [longitude, latitude] = step.location
      const distance = haversine({latitude, longitude}, {
        latitude: user.location[1],
        longitude: user.location[0]
      })
      console.log(step, distance)
      if (distance < 5) {
        Call.update({_id: step.callId}, {$set: {status: 'waiting'}}).catch(console.error)
        sendPush('7e213cc7b830b611a9e0cd17ff80f8f3030464a357d799276c6e8aa3b9b2d9b2')
      }
    })
  })
  .catch(console.error)
}

export const update = ({ bodymen: { body }, params, user }, res, next) => {
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isAdmin = user.role === 'admin'
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate && !isAdmin) {
        res.status(401).json({
          valid: false,
          message: 'You can\'t change other user\'s data'
        })
        return null
      }
      return result
    })
    .then((user) => {
      if (body.location) {
        user.location = body.location
        checkIfInRange(user)
      }
      return user ? _.merge(user, body).save() : null
    })
    .then((user) => {
      return user ? user.view(true) : null
    })
    .then(success(res))
    .catch(next)
}

export const updatePassword = ({ bodymen: { body }, params, user }, res, next) =>
  User.findById(params.id === 'me' ? user.id : params.id)
    .then(notFound(res))
    .then((result) => {
      if (!result) return null
      const isSelfUpdate = user.id === result.id
      if (!isSelfUpdate) {
        res.status(401).json({
          valid: false,
          param: 'password',
          message: 'You can\'t change other user\'s password'
        })
        return null
      }
      return result
    })
    .then((user) => user ? user.set({ password: body.password }).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)
