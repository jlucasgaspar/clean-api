import { SignUpController } from './SignUpController'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './SignUpProtocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAcountStub: AddAccount
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidatorStub()
    const addAcountStub = makeAddAcountStub()

    const sut = new SignUpController(emailValidatorStub, addAcountStub)

    return { sut, emailValidatorStub, addAcountStub }
}

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

const makeAddAcountStub = () => {
    class AddAccountStub implements AddAccount {
        add(account: AddAccountModel): AccountModel {
            const fakeAccount = {
                id: 'valid_id',
                name: account.name,
                email: account.email,
                password: account.password
            }

            return fakeAccount
        }
    }

    return new AddAccountStub()
}

describe('SignUp Controller', () => {
    test('should return 400 if no name is provided', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                //name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('should return 400 if no email is provided', () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                //email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('should return 400 if no password is provided', () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                //password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('should return 400 if no password confirmation is provided', () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                //passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('should return 400 if no password confirmation does not match with password', () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

    test('should return 400 if an invalid mail is provided', () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('should call EmailValidator with correct e-mail', () => {
        const { sut, emailValidatorStub } = makeSut()

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        sut.handle(httpRequest)
        
        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    test('should return 500 if EmailValidator throws', () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new ServerError()
        })

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('should call AddAccount with correct values', () => {
        const { sut, addAcountStub } = makeSut()

        const addSpy = jest.spyOn(addAcountStub, 'add')

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        sut.handle(httpRequest)
        
        expect(addSpy).toHaveBeenCalledWith({
            name: httpRequest.body.name,
            email: httpRequest.body.email,
            password: httpRequest.body.password
        })
    })

    test('should return 500 if AddAccount throws', () => {
        const { sut, addAcountStub } = makeSut()

        jest.spyOn(addAcountStub, 'add').mockImplementationOnce(() => {
            throw new ServerError()
        })

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('should return 200 if an valid data is provided', () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'valid_name',
                email: 'valid_email',
                password: 'valid_password',
                passwordConfirmation: 'valid_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: httpRequest.body.name,
            email: httpRequest.body.email,
            password: httpRequest.body.password
        })
    })
})