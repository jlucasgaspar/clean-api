import { AccountModel } from '../../../domain/models/Account'
import { AuthModel } from '../../../domain/useCases/Authentication'
import { HashComparer } from '../../protocols/cryptography/HashComparer'
import { Encrypter } from '../../protocols/cryptography/Encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/LoadAccountByEmailRepository'
import { UpdateAccessTokenRepository } from '../../protocols/db/account/UpdateAccessTokenRepository'
import { DbAuthentication } from './DbAuthentication'

interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    encrypterStub: Encrypter
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
})

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async loadByEmail(email: string): Promise<AccountModel> {
            const account = makeFakeAccount()
            return new Promise(resolve => resolve(account))
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare(value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }

    return new HashComparerStub()
}

const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(id: string): Promise<string> {
            return new Promise(resolve => resolve('any_token'))
        }
    }

    return new EncrypterStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
    class AccessTokenRepositoryStub implements UpdateAccessTokenRepository {
        async updateAccessToken(id: string, token: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new AccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
    const hashComparerStub = makeHashComparerStub()
    const encrypterStub = makeEncrypterStub()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()

    const sut = new DbAuthentication(
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub
    )

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub
    }
}

const makeFakeRequestAuthentication = (): AuthModel => ({
    email: 'any_email@mail.com',
    password: 'any_password'
})

describe('DbAuthentication UseCase', () => {
    /* LoadAccountByEmailRepository */
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        await sut.auth(makeFakeRequestAuthentication())
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
            new Promise((res, reject) => reject(new Error()))
        )
        const errorPromise = sut.auth(makeFakeRequestAuthentication())
        await expect(errorPromise).rejects.toThrow()
    })

    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
        const responseAccessToken = await sut.auth(makeFakeRequestAuthentication())
        expect(responseAccessToken).toBeNull()
    })

    /* HashComparer */
    test('Should call HashComparer with correct password', async () => {
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(makeFakeRequestAuthentication())
        expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })

    test('Should throw if HashComparer throws', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
            new Promise((res, reject) => reject(new Error()))
        )
        const errorPromise = sut.auth(makeFakeRequestAuthentication())
        await expect(errorPromise).rejects.toThrow()
    })

    test('Should return null if HashComparer returns false', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
            new Promise(resolve => resolve(false))
        )
        const responseAccessToken = await sut.auth(makeFakeRequestAuthentication())
        expect(responseAccessToken).toBeNull()
    })

    /* TokenGenerator (Encrypter) */
    test('Should call Encrypter with correct id', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.auth(makeFakeRequestAuthentication())
        expect(encryptSpy).toHaveBeenCalledWith('any_id')
    })

    test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            new Promise((res, reject) => reject(new Error()))
        )
        const errorPromise = sut.auth(makeFakeRequestAuthentication())
        await expect(errorPromise).rejects.toThrow()
    })
    /* Token Generator - Success */
    test('Should return a valid access token on success', async () => {
        const { sut } = makeSut()
        const accessToken = await sut.auth(makeFakeRequestAuthentication())
        expect(accessToken).toBe('any_token')
    })

    /* UpdateAccessToken Repository */
    test('Should call UpdateAccessTokenRepository with correct id', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        await sut.auth(makeFakeRequestAuthentication())
        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
    })

    test('Should throw if UpdateAccessTokenRepository throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(
            new Promise((res, reject) => reject(new Error()))
        )
        const errorPromise = sut.auth(makeFakeRequestAuthentication())
        await expect(errorPromise).rejects.toThrow()
    })
})