import { InvalidParamError } from '../../presentation/errors';
import { CompareFieldsValidation } from './compareFieldsValidation';

const makeSut = (): CompareFieldsValidation => {
    return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFields Validation', () => {
    test('Should return a InvalidParamError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'any_value', fieldToCompare: 'different_value' })
        expect(error).toEqual(new InvalidParamError('fieldToCompare'))
    })

    test('Should not return if validation succeeds', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'correct_value', fieldToCompare: 'correct_value' })
        expect(error).toBeFalsy()
    })
})