import { SignUpController } from './SignUpController'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './SignUpProtocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { ok, serverError, badRequest } from '../../helpers'
import { Validation } from '../../helpers/validators/Validation'

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
    addAcountStub: AddAccount
    validationStub: Validation
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidatorStub()
    const addAcountStub = makeAddAcountStub()
    const validationStub = makeValidatonStub()

    const sut = new SignUpController(emailValidatorStub, addAcountStub, validationStub)

    return { sut, emailValidatorStub, addAcountStub, validationStub }
}

const makeValidatonStub = (): Validation => {
    class ValidatonStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }

    return new ValidatonStub()
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

        const httpResponse = await await sut.handle(httpRequest)
        
        // expect(httpResponse).toEqual(badRequest(new MissingParamError('name'))) é igual a:
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('should return 400 if no email is provided', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                //email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        
        // expect(httpResponse).toEqual(badRequest(new MissingParamError('name'))) é igual a:
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('should return 400 if no password is provided', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                //password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('should return 400 if no password confirmation is provided', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                //passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('should return 400 if no password confirmation does not match with password', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)
        
        // expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation'))) é igual a:
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })

    test('should return 400 if an invalid mail is provided', async () => {
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

        const httpResponse = await sut.handle(httpRequest)
        
        // expect(httpResponse).toEqual(badRequest(new InvalidParamError('email'))) é igual a:
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('should call EmailValidator with correct e-mail', async () => {
        const { sut, emailValidatorStub } = makeSut()

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)
        
        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    test('should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new ServerError(null)
        })

        const httpRequest = makeFakeRequest()

        const httpResponse = await sut.handle(httpRequest)
        
        //expect(httpResponse).toEqual(serverError(new ServerError(null)))
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError(null))
    })

    test('should call AddAccount with correct values', async () => {
        const { sut, addAcountStub } = makeSut()

        const addSpy = jest.spyOn(addAcountStub, 'add')

        const httpRequest = makeFakeRequest()

        await sut.handle(httpRequest)
        
        expect(addSpy).toHaveBeenCalledWith({
            name: httpRequest.body.name,
            email: httpRequest.body.email,
            password: httpRequest.body.password
        })
    })

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
})