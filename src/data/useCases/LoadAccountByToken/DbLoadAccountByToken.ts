import { Decrypter } from '../../protocols/cryptography/Decrypter';
import { AccountModel } from '../../../domain/models/Account';
import { LoadAccountByToken } from '../../../domain/useCases/LoadAccountByToken';

export class DbLoadAccountByToken implements LoadAccountByToken {
    constructor(private readonly decrypter: Decrypter) {}

    async load(accessToken: string, role?: string): Promise<AccountModel> {
        await this.decrypter.decrypt(accessToken)

        return Promise.resolve(null)
    }
}