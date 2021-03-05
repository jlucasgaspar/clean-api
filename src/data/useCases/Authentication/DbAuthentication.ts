import { Authentication, AuthModel } from '../../../domain/useCases/Authentication'
import { HashComparer } from '../../protocols/cryptography/HashComparer'
import { Encrypter } from '../../protocols/cryptography/Encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/LoadAccountByEmailRepository'
import { UpdateAccessTokenRepository } from '../../protocols/db/account/UpdateAccessTokenRepository'

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly encrypter: Encrypter,
        private readonly updateaccessTokenRepository: UpdateAccessTokenRepository
    ) {}

    async auth(authData: AuthModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(authData.email)

        if (!account) {
            return null
        }

        const passwordIsValid = await this.hashComparer.compare(authData.password, account.password)

        if (!passwordIsValid) {
            return null
        }

        const accessToken = await this.encrypter.encrypt(account.id)

        await this.updateaccessTokenRepository.updateAccessToken(account.id, accessToken)

        return accessToken
    }
}