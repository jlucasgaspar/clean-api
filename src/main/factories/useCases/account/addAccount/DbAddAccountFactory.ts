import { AccountMongoRepository } from '@/infra/db/mongodb/AccountRepository/AccountMongoRepository'
import { BcryptAdapter } from '@/infra/cryptography/bcryptAdapter/BCryptAdapter'
import { AddAccount } from '@/domain/useCases/AddAccount'
import { DbAddAccount } from '@/data/useCases/AddAccount/DbAddAccount'

export const makeDbAddAccount = (): AddAccount => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()

    return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}