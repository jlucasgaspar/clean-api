import { SignUpController } from '../../presentation/controllers/SignUp/SignUpController'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter'
import { DbAddAccount } from '../../data/useCases/AddAccount/DbAddAccount'
import { BcryptAdapter } from '../../infra/cryptography/BCryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/AccountRepository/Account'
import { LogMongoRepository } from '../../infra/db/mongodb/LogRepository/Log'
import { LogControllerDecorator } from '../decorator/Log'
import { makeSignUpValidation } from './signupValidation'

export const makeSignUpController = (): Controller => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const emailValidatorAdapter = new EmailValidatorAdapter()

    const logErrorRepository = new LogMongoRepository()
    const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, makeSignUpValidation())
    
    return new LogControllerDecorator(signUpController, logErrorRepository)
}