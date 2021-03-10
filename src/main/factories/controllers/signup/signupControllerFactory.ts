import { SignUpController } from '../../../../presentation/controllers/Login/SignUp/SignUpController'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signupValidationFactory'
import { makeDbAuthentication } from '../../useCases/authentication/dbAuthenticationFactory'
import { makeDbAddAccount } from '../../useCases/addAccount/DbAddAccountFactory'
import { makeLogControllerDecorator } from '../../decorators/logControllerDecoratorFactory'

export const makeSignUpController = (): Controller => {
    const signUpController = new SignUpController(
        makeDbAddAccount(),
        makeSignUpValidation(),
        makeDbAuthentication()
    )

    return makeLogControllerDecorator(signUpController)
}