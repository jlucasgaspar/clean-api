import { DbLoadAccountByToken } from './DbLoadAccountByToken';
import { Decrypter } from '../../protocols/cryptography/Decrypter';

interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
}

const makeDecrypterStub = (): Decrypter => {
    class DecrypterSyub implements Decrypter {
        async decrypt (value: string): Promise<string> {
            return Promise.resolve('any_value')
        }
    }
    return new DecrypterSyub()
}

const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub)

    return { sut, decrypterStub }
}

describe('DbLoadAccountByToken UseCase', () => {
    test('should call Decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSut()
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
        await sut.load('any_token', 'any_role')
        expect(decryptSpy).toHaveBeenCalledWith('any_token')
    });

    test('should return null if Decrypter return null', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
        const account = await sut.load('any_token')
        expect(account).toBeNull()
    });
});