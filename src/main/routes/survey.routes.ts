import { Router } from 'express'
//import { adaptMiddleware } from '../adapters/expressMiddlewareAdapter'
//import { makeAuthMiddleware } from '../factories/middlewares/authMiddlewareFactory'
import { adaptRoute } from '../adapters/expressRouteAdapter'
import { makeAddSurveyController } from '../factories/controllers/survey/addSurvey/addsurveyControllerFactory'
import { makeLoadSurveysController } from '../factories/controllers/survey/loadSurveys/loadsurveysControllerFactory'

export default (router: Router): void => {
    //const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
    //const auth = adaptMiddleware(makeAuthMiddleware())
    router.post('/surveys', /* adminAuth, */ adaptRoute(makeAddSurveyController()))
    router.get('/surveys', /* auth, */ adaptRoute(makeLoadSurveysController()))
}