import { Encrypter } from './DbAddAccountProtocols'
import { DbAddAccount } from './DbAddAccount'

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
}

const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    
    return new EncrypterStub()
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypterStub()

    const sut = new DbAddAccount(encrypterStub)

    return { sut, encrypterStub }
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
})