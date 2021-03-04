import { MissingParamError } from "../../errors"
import { Validation } from "./Validation"
import { ValidationComposite } from "./validationComposite"

describe('ValidationComposite', () => {
    test('Should return an error if any validation fails', () => {
        class ValidationStub implements Validation {
            validate(input: any): Error {
                return new MissingParamError('field')
            }
        }
        
        const validationStub = new ValidationStub()
        const sut = new ValidationComposite([validationStub])
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new MissingParamError('field'))
    })
})