import { AccountModel } from '@/domain/models/Account'
import { AddAccountModel } from '@/domain/useCases/AddAccount'
import { MongoHelper } from '../helpers/mongoHelper'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/UpdateAccessTokenRepository';
import { AddAccountRepository } from '@/data/protocols/db/account/AddAccountRepository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/LoadAccountByEmailRepository';
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/LoadAccountByTokenRepository';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')

        const result = await accountCollection.insertOne(accountData)

        //const account = result.ops[0]
        return MongoHelper.map(result.ops[0])
    }

    async loadByEmail(email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')

        const account = await accountCollection.findOne({ email: email })

        return account && MongoHelper.map(account)
    }

    async updateAccessToken(id: string, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('accounts')

        await accountCollection.updateOne({_id: id }, {
            $set: {
                accessToken: token
            }
        })
    }

    async loadByToken(token: string, role?: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')

        const account = await accountCollection.findOne(
            { accessToken: token, $or: [{ role }, { role: 'admin' }] }
        )

        return account && MongoHelper.map(account)
    }
}