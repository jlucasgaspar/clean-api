import { Encrypter } from './../protocols/Encrypter'
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
})