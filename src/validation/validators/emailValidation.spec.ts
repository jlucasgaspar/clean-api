import { EmailValidation } from './emailValidation'
import { EmailValidator } from '../protocols/EmailValidator'
import { InvalidParamError, ServerError } from '../../presentation/errors'

interface SutTypes {
    sut: EmailValidation
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidatorStub()

    const sut = new EmailValidation('email', emailValidatorStub)

    return { sut, emailValidatorStub }
}

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

describe('Email Validation', () => {
    test('should return an error if EmailValidator returns false', () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const error = sut.validate({ email: 'wrong_email' })

        expect(error).toEqual(new InvalidParamError('email'))
    })

    test('should call EmailValidator with correct e-mail', () => {
        const { sut, emailValidatorStub } = makeSut()

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

        sut.validate({ email: 'any_email@mail.com' })
        
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    test('should throw if EmailValidator throws', () => {
        const { sut, emailValidatorStub } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new ServerError(null)
        })

        //const httpResponse = sut.validate({})

        expect(sut.validate).toThrow()
    })
})