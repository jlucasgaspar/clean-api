import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers'
import { LoginController } from './LoginController'
import { EmailValidator, HttpRequest } from '../SignUp/SignUpControllerProtocols'
import { Authentication, AuthModel } from '@/domain/useCases/Authentication'

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
    authenticationStub: Authentication
}

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidatorStub()
    const authenticationStub = makeAuthentication()
    const sut = new LoginController(emailValidatorStub, authenticationStub)

    return { sut, emailValidatorStub, authenticationStub }
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(authData: AuthModel): Promise<string> {
            return new Promise(resolve => resolve('valid_token'))
        }
    }

    return new AuthenticationStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@mail.com',
        password: 'any_password'
    }
})

describe('LoginController', () => {
    test('Should return 400 if no email is provided', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                //email: '',
                password: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is provided', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                //password: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })

    test('Should return 400 if an invalid e-mail is provided', async () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpRequest = {
            body: {
                email: 'invalid_email',
                password: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    test('Should call EmailValidator with correct e-mail', async () => {
        const { sut, emailValidatorStub } = makeSut()

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)

        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    test('Should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpRequest = makeFakeRequest()

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(serverError(new Error()))
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

    test('Should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()

        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const httpRequest = makeFakeRequest()

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(unauthorized())
    })

    test('Should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()

        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )

        const httpRequest = makeFakeRequest()

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('Should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut()

        const httpRequest = makeFakeRequest()

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(ok({ token: 'valid_token' }))
    })
})