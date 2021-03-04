import { Authentication, AuthModel } from '../../../domain/useCases/Authentication'
import { HashComparer } from '../../protocols/cryptography/HashComparer'
import { TokenGenerator } from '../../protocols/cryptography/TokenGenerator'
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository'
import { UpdateAccessTokenRepository } from '../../protocols/db/UpdateAccessTokenRepository'

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer
    private readonly tokenGenerator: TokenGenerator
    private readonly updateaccessTokenRepository: UpdateAccessTokenRepository

    constructor(
        loadAccountByEmailRepository: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        tokenGenerator: TokenGenerator,
        updateaccessTokenRepository: UpdateAccessTokenRepository
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
        this.hashComparer = hashComparer
        this.tokenGenerator = tokenGenerator
        this.updateaccessTokenRepository = updateaccessTokenRepository
    }

    async auth(authData: AuthModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authData.email)

        if (!account) {
            return null
        }

        const passwordIsValid = await this.hashComparer.compare(authData.password, account.password)

        if (!passwordIsValid) {
            return null
        }

        const accessToken = await this.tokenGenerator.generate(account.id)

        await this.updateaccessTokenRepository.update(account.id, accessToken)

        return accessToken
    }
}