import { LoadAccountByTokenRepository } from './../../protocols/db/account/LoadAccountByTokenRepository';
import { Decrypter } from '../../protocols/cryptography/Decrypter';
import { AccountModel } from '../../../domain/models/Account';
import { LoadAccountByToken } from '../../../domain/useCases/LoadAccountByToken';

export class DbLoadAccountByToken implements LoadAccountByToken {
    constructor(
        private readonly decrypter: Decrypter,
        private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
    ) {}

    async load(accessToken: string, role?: string): Promise<AccountModel> {
        const token: any = await this.decrypter.decrypt(accessToken)

        if (!token) {
            return null
        }

        const account = await this.loadAccountByTokenRepository.loadByToken(token, role)

        console.log('account: ', account)

        if (!account) {
            return null
        }

        return account
    }
}