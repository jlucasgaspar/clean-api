import { LoadAccountByTokenRepository } from './../../protocols/db/account/LoadAccountByTokenRepository';
import { DbLoadAccountByToken } from './DbLoadAccountByToken';
import { Decrypter } from '../../protocols/cryptography/Decrypter';
import { AccountModel } from '../../../domain/models/Account';

interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
    loadAccountByTokenRepository: LoadAccountByTokenRepository
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeDecrypterStub = (): Decrypter => {
    class DecrypterSyub implements Decrypter {
        async decrypt (value: string): Promise<string> {
            return Promise.resolve('any_value')
        }
    }
    return new DecrypterSyub()
}

const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
        async loadByToken (token: string, role?: string): Promise<AccountModel> {
            return Promise.resolve(makeFakeAccount())
        }
    }
    return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
    const loadAccountByTokenRepository = makeLoadAccountByTokenRepositoryStub()
    const decrypterStub = makeDecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepository)

    return { sut, decrypterStub, loadAccountByTokenRepository }
}

describe('DbLoadAccountByToken UseCase', () => {
    test('should call Decrypter with correct values', async () => {
        const { sut, decrypterStub } = makeSut()
        const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
        await sut.load('any_token', 'any_role')
        expect(decryptSpy).toHaveBeenCalledWith('any_token')
    });

    test('should return null if Decrypter returns null', async () => {
        const { sut, decrypterStub } = makeSut()
        jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null));
        const account = await sut.load('any_token', 'any_role')
        expect(account).toBeNull()
    });

    test('should call LoadAccountByTokenRepository with correct values', async () => {
        const { sut, loadAccountByTokenRepository } = makeSut()
        const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepository, 'loadByToken')
        await sut.load('any_token', 'any_role')
        expect(loadByTokenSpy).toHaveBeenCalledWith('any_value', 'any_role')
    });

    test('should return null if LoadAccountByTokenRepository returns null', async () => {
        const { sut, loadAccountByTokenRepository } = makeSut()
        jest.spyOn(loadAccountByTokenRepository, 'loadByToken').mockReturnValueOnce(Promise.resolve(null));
        const account = await sut.load('any_token', 'any_role')
        expect(account).toBeNull()
    });
   
    test('should return an account on success', async () => {
        const { sut } = makeSut()
        const account = await sut.load('any_token', 'any_role')
        expect(account).toEqual(makeFakeAccount())
    });
});