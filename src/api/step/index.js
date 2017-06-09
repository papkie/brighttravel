import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Step, { schema } from './model'

const router = new Router()
const { callId, type } = schema.tree

/**
 * @api {post} /steps Create step
 * @apiName CreateStep
 * @apiGroup Step
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam callId Step's callId.
 * @apiParam type Step's type.
 * @apiSuccess {Object} step Step's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Step not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ callId, type }),
  create)

/**
 * @api {get} /steps Retrieve steps
 * @apiName RetrieveSteps
 * @apiGroup Step
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} steps List of steps.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /steps/:id Retrieve step
 * @apiName RetrieveStep
 * @apiGroup Step
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} step Step's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Step not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /steps/:id Update step
 * @apiName UpdateStep
 * @apiGroup Step
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam callId Step's callId.
 * @apiParam type Step's type.
 * @apiSuccess {Object} step Step's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Step not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ callId, type }),
  update)

/**
 * @api {delete} /steps/:id Delete step
 * @apiName DeleteStep
 * @apiGroup Step
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Step not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
