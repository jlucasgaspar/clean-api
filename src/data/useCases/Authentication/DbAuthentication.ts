import { Authentication, AuthModel } from '../../../domain/useCases/Authentication'
import { HashComparer } from '../../protocols/cryptography/HashComparer'
import { TokenGenerator } from '../../protocols/cryptography/TokenGenerator'
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository'

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    private readonly hashComparer: HashComparer
    private readonly tokenGenerator: TokenGenerator

    constructor(
        loadAccountByEmailRepository: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        tokenGenerator: TokenGenerator
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
        this.hashComparer = hashComparer
        this.tokenGenerator = tokenGenerator
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

        const token = await this.tokenGenerator.generate(account.id)
    }
}