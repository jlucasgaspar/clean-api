import { SignUpController } from '../../presentation/controllers/SignUp/SignUpController'
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter'
import { DbAddAccount } from '../../data/useCases/AddAccount/DbAddAccount'
import { BcryptAdapter } from '../../infra/cryptography/BCryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/AccountRepository/Account'

export const makeSignUpController = (): SignUpController => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)

    const accountMongoRepository = new AccountMongoRepository()

    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)

    const emailValidatorAdapter = new EmailValidatorAdapter()

    const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount)

    return signUpController
}