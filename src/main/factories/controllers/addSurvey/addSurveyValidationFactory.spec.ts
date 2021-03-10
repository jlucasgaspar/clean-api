import { Validation } from '../../../../presentation/protocols/Validation'
import { makeAddSurveyValidation } from './addSurveyValidationFactory'
import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'

jest.mock('../../../../validation/validators/validationComposite') //mesmo path do ValidationComposite

describe('AddSurveyValidation Factory', () => {
    test('Should call ValidationComposite with all validations', () => {
        makeAddSurveyValidation()

        const validations: Validation[] = []
        
        for (const field of ['question', 'answers']) {
            validations.push(new RequiredFieldValidation(field))
        }

        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})