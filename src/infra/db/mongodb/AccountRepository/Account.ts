import { AddAccountRepository } from '../../../../data/protocols/AddAccountRepository'
import { AccountModel } from '../../../../domain/models/Account'
import { AddAccountModel } from '../../../../domain/useCases/AddAccount'
import { MongoHelper } from '../helpers/mongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts')

        const result = await accountCollection.insertOne(accountData)

        const account = result.ops[0]

        const { _id, ...accountWithout_id } = account
    
        return Object.assign({}, accountWithout_id, { id: _id })
    }
}