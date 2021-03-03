import { CompareFieldsValidation } from '../../presentation/helpers/validators/compareFieldsValidation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/requiredFieldValidation'
import { Validation } from '../../presentation/helpers/validators/Validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validationComposite'
import { makeSignUpValidation } from './signupValidation'

//mesmo path do ValidationComposite
jest.mock('../../presentation/helpers/validators/validationComposite')

describe('SignUpValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeSignUpValidation()

        const validations: Validation[] = []
        
        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field))
        }

        validations.push(new CompareFieldsValidation('password', 'passwordConfirmarion'))

        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})