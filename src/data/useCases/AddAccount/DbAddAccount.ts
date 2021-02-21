import { AccountModel } from '../../../domain/models/Account'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/AddAccount'
import { Encrypter } from '../protocols/Encrypter'

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