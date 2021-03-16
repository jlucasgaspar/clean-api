import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/LoadAccountByEmailRepository';
import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './DbAddAccountProtocols'

export class DbAddAccount implements AddAccount {
    constructor(
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) {}

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountAlreadyExists = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

        if (accountAlreadyExists) {
            return null
        }

        const hashedPassword = await this.hasher.hash(accountData.password)

        const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))

        return account
    }
}