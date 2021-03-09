import { SignUpController } from './SignUpController'
import { AccountModel, AddAccount, AddAccountModel } from './SignUpControllerProtocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { ok, badRequest } from '../../helpers'
import { Validation } from '../../protocols/Validation'
import { Authentication, AuthModel } from '../../../domain/useCases/Authentication'

interface SutTypes {
    sut: SignUpController
    addAcountStub: AddAccount
    validationStub: Validation
    authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
    const addAcountStub = makeAddAcountStub()
    const validationStub = makeValidatonStub()
    const authenticationStub = makeAuthentication()

    const sut = new SignUpController(addAcountStub, validationStub, authenticationStub)

    return { sut, addAcountStub, validationStub, authenticationStub }
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(authData: AuthModel): Promise<string> {
            return new Promise(resolve => resolve('valid_token'))
        }
    }

    return new AuthenticationStub()
}

const makeValidatonStub = (): Validation => {
    class ValidatonStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }

    return new ValidatonStub()
}

const makeAddAcountStub = () => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: account.name,
                email: account.email,
                password: account.password
            }

            return new Promise(resolve => resolve(fakeAccount))
        }
    }

    return new AddAccountStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

const makeFakeAccount = (account): AccountModel => ({
    id: 'valid_id',
    name: account.body.name,
    email: account.body.email,
    password: account.body.password
})

describe('SignUp Controller', () => {
    test('should return 500 if AddAccount throws', async () => {
        const { sut, addAcountStub } = makeSut()

        jest.spyOn(addAcountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new ServerError(null)))
        })

        const httpRequest = makeFakeRequest()

        const httpResponse = await sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError(null))
    })

    test('should return 200 if an valid data is provided', async () => {
        const { sut } = makeSut()

        const httpRequest = makeFakeRequest()

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(ok(makeFakeAccount(httpRequest))) // É a mesma coisa que os 2:
        /* expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual(makeFakeAccount(httpRequest)) */
    })

    test('should call Validation with correct values', async () => {
        const { sut, validationStub } = makeSut()

        const validateSpy = jest.spyOn(validationStub, 'validate')

        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)
        
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut()

        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

        const httpRequest = makeFakeRequest()

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })

    test('Should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()

        const authSpy = jest.spyOn(authenticationStub, 'auth')

        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)

        expect(authSpy).toHaveBeenCalledWith({
            email: httpRequest.body.email, password: httpRequest.body.password
        })
    })
})