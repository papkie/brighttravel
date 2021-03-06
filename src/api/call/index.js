import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, showSteps, update, destroy, nextStep, accept } from './controller'
import { schema } from './model'
export Call, { schema } from './model'

const router = new Router()
const { currentStepId, status, startLocation, endLocation, stepsLiteral } = schema.tree

/**
 * @api {post} /calls Create call
 * @apiName CreateCall
 * @apiGroup Call
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam {Number[2][]} steps in lon, lat format.
 * @apiSuccess {Object} call Call's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Call not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({
    steps: {
      type: [[String]],
      index: '2d'
    },
    stepsLiteral
  }),
  create)

/**
 * @api {get} /calls Retrieve calls
 * @apiName RetrieveCalls
 * @apiGroup Call
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} calls List of calls.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /calls/:id Retrieve call
 * @apiName RetrieveCall
 * @apiGroup Call
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} call Call's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Call not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {get} /calls/:id Retrieve call steps
 * @apiName RetrieveCall
 * @apiGroup Call
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} call Call's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Call not found.
 * @apiError 401 user access only.
 */
router.get('/:id/steps',
  token({ required: true }),
  showSteps)

/**
 * @api {put} /calls/:id Update call
 * @apiName UpdateCall
 * @apiGroup Call
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam currentStepId Call's currentStepId.
 * @apiParam status Call's status.
 * @apiParam startLocation Call's start point.
 * @apiParam endLocation Call's end point.
 * @apiSuccess {Object} call Call's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Call not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ currentStepId, status, startLocation, endLocation, stepsLiteral }),
  update)

/**
 * @api {delete} /calls/:id Delete call
 * @apiName DeleteCall
 * @apiGroup Call
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Call not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

/**
 * @api {post} /calls/:id/nextStep Post call next step
 * @apiName PostCallNextStep
 * @apiGroup Call
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Call not found.
 * @apiError 401 user access only.
 */
router.post('/:id/nextStep',
  token({ required: true }),
  nextStep)

/**
 * @api {post} /calls/:id/nextStep Accept call
 * @apiName PostCallAccept
 * @apiGroup Call
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Call not found.
 * @apiError 401 user access only.
 */
router.post('/:id/accept',
  token({ required: true }),
  accept)

export default router
