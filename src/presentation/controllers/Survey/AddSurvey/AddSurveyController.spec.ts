import { AddSurveyController } from './AddSurveyController'
import { HttpRequest, Validation } from '../../../protocols'
import { badRequest } from '../../../helpers';
import { AddSurvey, AddSurveyModel } from '../../../../domain/useCases/AddSurvey';

interface SutTypes {
    sut: AddSurveyController
    validationStub: Validation
    addSurveyStub: AddSurvey
}

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null;
        }
    }
    return new ValidationStub()
}

const makeAddSurveyStub = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
        add(data: AddSurveyModel): Promise<void> {
            return new Promise(resolve => resolve());
        }
    }
    return new AddSurveyStub()
}

const makeSut = (): SutTypes => {
    const addSurveyStub = makeAddSurveyStub()
    const validationStub = makeValidationStub()
    const sut = new AddSurveyController(validationStub, addSurveyStub)

    return { sut, validationStub, addSurveyStub }
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        question: 'any_question',
        answers: [
            { image: 'any_image', answer: 'any_answer' }
        ]
    }
})

describe('AddSurvey Controller', () => {
    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(validateSpy).toHaveBeenLastCalledWith(httpRequest.body)
    });

    test('should return 400 if validation fails', async () => {
        const { sut, validationStub } = makeSut()
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
        const httpRequest = makeFakeRequest()
        const httpResponseError = await sut.handle(httpRequest)
        expect(httpResponseError).toEqual(badRequest(new Error()))
    });

    test('should call addSurvey useCase with correct values', async () => {
        const { sut, addSurveyStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyStub, 'add')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenLastCalledWith(httpRequest.body)
    });
});