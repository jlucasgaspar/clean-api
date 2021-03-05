import env from '../../config/env'
import { LoginController } from '../../../presentation/controllers/Login/LoginController';
import { Controller } from '../../../presentation/protocols';
import { LogMongoRepository } from '../../../infra/db/mongodb/LogRepository/LogMongoRepository'
import { LogControllerDecorator } from '../../decorator/LogControllerDecorator'
import { EmailValidatorAdapter } from '../../adapters/validators/EmailValidatorAdapter';
import { DbAuthentication } from '../../../data/useCases/Authentication/DbAuthentication';
import { AccountMongoRepository } from '../../../infra/db/mongodb/AccountRepository/AccountMongoRepository';
import { BcryptAdapter } from '../../../infra/cryptography/bcryptAdapter/BCryptAdapter'
import { JwtAdapater } from '../../../infra/cryptography/jwtAdapater/JwtAdapater'

export const makeLoginController = (): Controller => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const secretKey = env.jwtSecret
    const jwtAdapter = new JwtAdapater(secretKey)
    const accountMongoRepository = new AccountMongoRepository()

    const emailValidator = new EmailValidatorAdapter()
    const authentication = new DbAuthentication(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository
    )

    const loginController = new LoginController(emailValidator, authentication)
    const logErrorRepository = new LogMongoRepository()

    return new LogControllerDecorator(loginController, logErrorRepository)
}