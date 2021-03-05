import { Router } from 'express'
import { makeSignUpController } from '../factories/signup/signupFactory'
import { adaptRoute } from '../adapters/express/expressRouteAdapter'

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignUpController()))
}