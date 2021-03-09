import { Validation } from '../../../../presentation/protocols/Validation'
import { EmailValidator } from '../../../../presentation/protocols/EmailValidator'
import { makeSignUpValidation } from './signupValidationFactory'
import {
    CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite
} from '../../../../presentation/helpers/validators'

jest.mock('../../../../presentation/helpers/validators/validationComposite') //mesmo path do ValidationComposite

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