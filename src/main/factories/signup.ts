import { SignUpController } from '../../presentation/controllers/SignUp/SignUpController'
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter'
import { DbAddAccount } from '../../data/useCases/AddAccount/DbAddAccount'
import { BcryptAdapter } from '../../infra/cryptography/BCryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/AccountRepository/Account'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorator/Log'

export const makeSignUpController = (): Controller => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
    const emailValidatorAdapter = new EmailValidatorAdapter()

    const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)
    return new LogControllerDecorator(signUpController)
}