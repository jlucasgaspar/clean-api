import { Hasher, AddAccountModel, AccountModel, AddAccountRepository } from './DbAddAccountProtocols'
import { DbAddAccount } from './DbAddAccount'

interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const hasherStub = Hasher()
    const addAccountRepositoryStub = makeAddAccountRepositoryStub()

    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

    return { sut, hasherStub, addAccountRepositoryStub }
}

const Hasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hash(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    
    return new HasherStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {
            const fakeCreatedAccount = {
                id: 'valid_id',
                name: accountData.name,
                email: accountData.email,
                password: 'hashed_password'
            }

            return new Promise(resolve => resolve(fakeCreatedAccount))
        }
    }
    
    return new AddAccountRepositoryStub()
}

describe('DbAddAccount UseCase', () => {
    test('should call hasher with correct password', async () => {
        const { sut, hasherStub } = makeSut()

        const hashSpy = jest.spyOn(hasherStub, 'hash')

        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }

        await sut.add(accountData)

        expect(hashSpy).toBeCalledWith(accountData.password)
    })

    test('should throw if hasher throws', async () => {
        const { sut, hasherStub } = makeSut()

        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => {
            return reject(new Error())
        }))

        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }

        const promise = sut.add(accountData)

        await expect(promise).rejects.toThrow()
    })

    test('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()

        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        
        await sut.add(accountData)
        
        expect(addSpy).toHaveBeenCalledWith({
            name: accountData.name,
            email: accountData.email,
            password: 'hashed_password'
        })
    })

    test('should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()

        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => {
            return reject(new Error())
        }))

        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }

        const promise = sut.add(accountData)

        await expect(promise).rejects.toThrow()
    })

    test('should return an account on success', async () => {
        const { sut } = makeSut()

        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }
        
        const account = await sut.add(accountData)
        
        expect(account).toEqual({
            id: 'valid_id',
            name: accountData.name,
            email: accountData.email,
            password: 'hashed_password'
        })
    })
})