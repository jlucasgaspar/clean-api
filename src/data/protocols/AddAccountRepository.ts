import { AccountModel } from '../../domain/models/Account';
import { AddAccountModel } from '../../domain/useCases/AddAccount';

export interface AddAccountRepository {
    add (accountData: AddAccountModel): Promise<AccountModel>
}