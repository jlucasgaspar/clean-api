import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compareFieldsValidation'
import { EmailValidation } from '../../../presentation/helpers/validators/emailValidation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/requiredFieldValidation'
import { Validation } from '../../../presentation/helpers/validators/Validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validationComposite'
import { EmailValidator } from '../../../presentation/protocols/EmailValidator'
import { makeSignUpValidation } from './signupValidation'

jest.mock('../../../presentation/helpers/validators/validationComposite') //mesmo path do ValidationComposite

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }

    return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()

        const validations: Validation[] = []
        
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }

        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

        validations.push(new EmailValidation('email', makeEmailValidatorStub()))

        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})