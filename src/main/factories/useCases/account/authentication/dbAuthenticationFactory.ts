import env from '@/main/config/env'
import { Authentication } from '@/domain/useCases/Authentication'
import { DbAuthentication } from '@/data/useCases/Authentication/DbAuthentication'
import { AccountMongoRepository } from '@/infra/db/mongodb/AccountRepository/AccountMongoRepository'
import { BcryptAdapter } from '@/infra/cryptography/bcryptAdapter/BCryptAdapter'
import { JwtAdapater } from '@/infra/cryptography/jwtAdapater/JwtAdapater'

export const makeDbAuthentication = (): Authentication => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)
    const secretKey = env.jwtSecret
    const jwtAdapter = new JwtAdapater(secretKey)
    const accountMongoRepository = new AccountMongoRepository()

    return new DbAuthentication(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository
    )
}