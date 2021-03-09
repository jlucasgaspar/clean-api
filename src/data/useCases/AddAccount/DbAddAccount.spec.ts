import { Hasher, AddAccountModel, AccountModel, AddAccountRepository } from './DbAddAccountProtocols'
import { DbAddAccount } from './DbAddAccount'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/LoadAccountByEmailRepository'

interface SutTypes {
    sut: DbAddAccount
    hasherStub: Hasher
    addAccountRepositoryStub: AddAccountRepository
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
    const hasherStub = Hasher()
    const addAccountRepositoryStub = makeAddAccountRepositoryStub()
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()

    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

    return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub }
}

const Hasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hash(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    
    return new HasherStub()
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<null> {
            return new Promise(resolve => resolve(null))
        }
    }

    return new LoadAccountByEmailRepositoryStub()
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

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

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

    test('should return null if LoadAccountByEmailRepository returns an account', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()

        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
            new Promise(resolve => resolve(makeFakeAccount()))
        )

        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }

        const account = await sut.add(accountData)

        expect(account).toBeNull()
    })

    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()

        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }

        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

        await sut.add(accountData)

        expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
    })
})