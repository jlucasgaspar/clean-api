import { SignUpController } from '../../../presentation/controllers/SignUp/SignUpController'
import { Controller } from '../../../presentation/protocols'
import { DbAddAccount } from '../../../data/useCases/AddAccount/DbAddAccount'
import { BcryptAdapter } from '../../../infra/cryptography/bcryptAdapter/BCryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/AccountRepository/AccountMongoRepository'
import { LogMongoRepository } from '../../../infra/db/mongodb/LogRepository/LogMongoRepository'
import { LogControllerDecorator } from '../../decorator/LogControllerDecorator'
import { makeSignUpValidation } from './signupValidationFactory'

export const makeSignUpController = (): Controller => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

    const logErrorRepository = new LogMongoRepository()
    const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation())
    
    return new LogControllerDecorator(signUpController, logErrorRepository)
}