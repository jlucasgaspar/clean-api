import { Router } from 'express'
import { adaptRoute } from '../adapters/expressRouteAdapter'
import { makeAddSurveyController } from '../factories/controllers/survey/addSurvey/addsurveyControllerFactory'

export default (router: Router): void => {
    router.post('/surveys', adaptRoute(makeAddSurveyController()))
}