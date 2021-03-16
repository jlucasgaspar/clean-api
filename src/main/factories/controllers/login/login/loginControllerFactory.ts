import { LoginController } from '../../../../../presentation/controllers/Login/Login/LoginController';
import { Controller } from '../../../../../presentation/protocols';
import { EmailValidatorAdapter } from '../../../../../infra/validators/EmailValidatorAdapter';
import { makeDbAuthentication } from '../../../useCases/account/authentication/dbAuthenticationFactory';
import { makeLogControllerDecorator } from '../../../decorators/logControllerDecoratorFactory';

export const makeLoginController = (): Controller => {
    const emailValidator = new EmailValidatorAdapter()
    const authentication = makeDbAuthentication()

    const loginController = new LoginController(emailValidator, authentication)

    return makeLogControllerDecorator(loginController)
    //return makeLogControllerDecorator(new LoginController(emailValidator, authentication))
}