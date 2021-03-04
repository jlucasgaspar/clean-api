import { Authentication, AuthModel } from '../../../domain/useCases/Authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository'

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

    constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository
    }

    async auth(authData: AuthModel): Promise<string> {
        const accessToken = await this.loadAccountByEmailRepository.load(authData.email)

        if (!accessToken) {
            return null
        }
    }
}