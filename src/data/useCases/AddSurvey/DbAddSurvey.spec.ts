import Mockdate from 'mockdate'
import { AddSurveyRepository } from './../../protocols/db/survey/AddSurveyRepository';
import { DbAddSurvey } from './DbAddSurvey';
import { AddSurveyModel } from "../../../domain/useCases/AddSurvey";

interface SutTypes {
    addSurveyRepositoryStub: AddSurveyRepository
    sut: DbAddSurvey
}

const makeFakeSurveyRequest = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
        image: 'any_image',
        answer: 'any_answer'
    }],
    date: new Date()
})

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
        add(surveyData: AddSurveyModel): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new AddSurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
    const sut = new DbAddSurvey(addSurveyRepositoryStub)

    return { sut, addSurveyRepositoryStub }
}

describe('DbAddSurvey UseCase', () => {
    beforeAll(() => {
        Mockdate.set(new Date())
    })

    beforeAll(() => {
        Mockdate.reset()
    })
    
    test('should call AddSurveyRepository with correct values', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
        const surveyData = makeFakeSurveyRequest()
        await sut.add(surveyData)
        expect(addSpy).toHaveBeenCalledWith(surveyData)
    });

    test('should throw if AddSurveyRepository throws', async () => {
        const { sut, addSurveyRepositoryStub } = makeSut()
        jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(new Promise((res, rej) => rej(new Error())))
        const surveyData = makeFakeSurveyRequest()
        const promiseError = sut.add(surveyData)
        await expect(promiseError).rejects.toThrow()
    });
});