import { DbLoadAccountByToken } from './DbLoadAccountByToken';
import { Decrypter } from '../../protocols/cryptography/Decrypter';

const makeDecrypterStub = () => {
    class DecrypterSyub implements Decrypter {
        async decrypt (value: string): Promise<string> {
            return Promise.resolve('any_value')
        }
    }
    return new DecrypterSyub()
}

const makeSut = () => {
    const decrypterStub = makeDecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub)

    return { sut, decrypterStub }
}

describe('DbLoadAccountByToken UseCase', () => {
    test('should call Decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSut()
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
        await sut.load('any_token')
        expect(decryptSpy).toHaveBeenCalledWith('any_token')
    });
});