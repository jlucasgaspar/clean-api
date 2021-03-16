import { SignUpController } from '@/presentation/controllers/Login/SignUp/SignUpController'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from './signupValidationFactory'
import { makeDbAuthentication } from '@/main/factories/useCases/account/authentication/dbAuthenticationFactory'
import { makeDbAddAccount } from '@/main/factories/useCases/account/addAccount/DbAddAccountFactory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory'

export const makeSignUpController = (): Controller => {
    const signUpController = new SignUpController(
        makeDbAddAccount(),
        makeSignUpValidation(),
        makeDbAuthentication()
    )

    return makeLogControllerDecorator(signUpController)
}