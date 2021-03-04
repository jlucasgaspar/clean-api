import { AddAccountRepository } from '../../../../data/protocols/db/AddAccountRepository'
import { AccountModel } from '../../../../domain/models/Account'
import { AddAccountModel } from '../../../../domain/useCases/AddAccount'
import { MongoHelper } from '../helpers/mongoHelper'

export class AccountMongoRepository implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')

        const result = await accountCollection.insertOne(accountData)

        //const account = result.ops[0]
        return MongoHelper.map(result.ops[0])
    }
}