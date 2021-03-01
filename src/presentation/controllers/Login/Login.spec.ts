import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { LoginController } from './Login'
import { EmailValidator } from '../SignUp/SignUpProtocols'

interface SutTypes {
    sut: LoginController
    emailValidatorStub: EmailValidator
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
    const sut = new LoginController(emailValidatorStub)

    return { sut, emailValidatorStub }
}

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

    test('Should call EmailValidator with correct e-mail', async () => {
        const { sut, emailValidatorStub } = makeSut()

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                password: 'any_password'
            }
        }

        await sut.handle(httpRequest)

        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })
})