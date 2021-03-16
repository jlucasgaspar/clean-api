import { Router } from 'express'
//import { adaptMiddleware } from '../adapters/expressMiddlewareAdapter'
//import { makeAuthMiddleware } from '../factories/middlewares/authMiddlewareFactory'
import { adaptRoute } from '../adapters/expressRouteAdapter'
import { makeAddSurveyController } from '../factories/controllers/survey/addSurvey/addsurveyControllerFactory'

export default (router: Router): void => {
    //const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
    router.post('/surveys', /* adminAuth, */ adaptRoute(makeAddSurveyController()))
}