import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './DbAddAccountProtocols'
import { DbAddAccount } from './DbAddAccount'

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
    addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypterStub()
    const addAccountRepositoryStub = makeAddAccountRepositoryStub()

    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

    return { sut, encrypterStub, addAccountRepositoryStub }
}

const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    
    return new EncrypterStub()
}

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: accountData.name,
                email: accountData.email,
                password: 'hashed_password'
            }

            return new Promise(resolve => resolve(fakeAccount))
        }
    }
    
    return new AddAccountRepositoryStub()
}

describe('DbAddAccount UseCase', () => {
    test('should call encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()

        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

        const accountData = {
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        }

        await sut.add(accountData)

        expect(encryptSpy).toBeCalledWith(accountData.password)
    })

    test('should throw if encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()

        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => {
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
            id: 'valid_id',
            name: accountData.name,
            email: accountData.email,
            password: 'hashed_password'
        })
    })
})