import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './requiredFieldValidation';

describe('RequiredField Validation', () => {
    test('Should return a MissingParamError if validation fails', () => {
        const sut = new RequiredFieldValidation('any_field')
        const error = sut.validate({ name: 'any_name' })
        expect(error).toEqual(new MissingParamError('any_field'))
    })
})