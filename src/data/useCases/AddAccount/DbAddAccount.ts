import { AddAccount, AddAccountModel, AccountModel, Encrypter } from './DbAddAccountProtocols'

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter

    constructor (encrypter: Encrypter) {
        this.encrypter = encrypter
    }

    async add(account: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.encrypter.encrypt(account.password)

        return new Promise(resolve => resolve(null))
    }
}