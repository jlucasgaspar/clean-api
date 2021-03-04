import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compareFieldsValidation'
import { EmailValidation } from '../../../presentation/helpers/validators/emailValidation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/requiredFieldValidation'
import { Validation } from '../../../presentation/helpers/validators/Validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validationComposite'
import { EmailValidatorAdapter } from '../../../utils/EmailValidatorAdapter'

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: Validation[] = []
        
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
        validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

    return new ValidationComposite(validations)
}