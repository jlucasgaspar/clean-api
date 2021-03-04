import { AccountModel } from '../../../domain/models/Account'
import { AuthModel } from '../../../domain/useCases/Authentication'
import { LoadAccountByEmailRepository } from '../../protocols/LoadAccountByEmailRepository'
import { DbAuthentication } from './DbAuthentication'

interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
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

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

    return {
        sut,
        loadAccountByEmailRepositoryStub
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
})