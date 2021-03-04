import { AccountModel } from '../../../domain/models/Account'
import { AuthModel } from '../../../domain/useCases/Authentication'
import { HashComparer } from '../../protocols/cryptography/HashComparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository'
import { DbAuthentication } from './DbAuthentication'

interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
}

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
})

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string): Promise<AccountModel> {
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

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
    const hashComparerStub = makeHashComparerStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub)

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub
    }
}

const makeFakeRequestAuthentication = (): AuthModel => ({
    email: 'any_email@mail.com',
    password: 'any_password'
})

describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        await sut.auth(makeFakeRequestAuthentication())
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
            new Promise((res, reject) => reject(new Error()))
        )
        const errorPromise = sut.auth(makeFakeRequestAuthentication())
        await expect(errorPromise).rejects.toThrow()
    })

    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
        const responseAccessToken = await sut.auth(makeFakeRequestAuthentication())
        expect(responseAccessToken).toBeNull()
    })

    test('Should call HashComparer with correct password', async () => {
        const { sut, hashComparerStub } = makeSut()
        const compareSpy = jest.spyOn(hashComparerStub, 'compare')
        await sut.auth(makeFakeRequestAuthentication())
        expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
    })

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
            new Promise((res, reject) => reject(new Error()))
        )
        const errorPromise = sut.auth(makeFakeRequestAuthentication())
        await expect(errorPromise).rejects.toThrow()
    })
})