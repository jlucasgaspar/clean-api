import { LoadAccountByToken } from '../../../../../domain/useCases/LoadAccountByToken'
import { DbLoadAccountByToken } from '../../../../../data/useCases/LoadAccountByToken/DbLoadAccountByToken'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/AccountRepository/AccountMongoRepository'
import { JwtAdapater } from '../../../../../infra/cryptography/jwtAdapater/JwtAdapater'
import env from '../../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
    const jwtAdapter = new JwtAdapater(env.jwtSecret)
    const accountMongoRepository = new AccountMongoRepository()

    return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}