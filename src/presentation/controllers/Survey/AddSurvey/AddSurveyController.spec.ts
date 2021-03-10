import { AddSurveyController } from './AddSurveyController'
import { HttpRequest, Validation } from '../../../protocols'

const makeFakeRequest = (): HttpRequest => ({
    body: {
        question: 'any_question',
        answers: [
            { image: 'any_image', answer: 'any_answer' }
        ]
    }
})

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null;
        }
    }
    return new ValidationStub()
}

describe('AddSurvey Controller', () => {
    test('should call validation with correct values', async () => {
        const validationStub = makeValidationStub()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const sut = new AddSurveyController(validationStub)
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenLastCalledWith(httpRequest.body)
    });
});