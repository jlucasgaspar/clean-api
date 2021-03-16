import Mockdate from 'mockdate'
import { LoadSurveysController } from './LoadSurveysController';
import { LoadSurveys } from './../../../../domain/useCases/LoadSurveys';
import { SurveyModel } from './../../../../domain/models/Survey';
import { noContent, ok, serverError } from '../../../helpers';

interface SutTypes {
    loadSurveysStub: LoadSurveys
    sut: LoadSurveysController
}

const makeFakesurveys = (): SurveyModel[] => ([
    {
        id: 'any_id',
        question: 'any_question',
        answers: [{ answer: 'any_answer', image: 'any_image' }, { answer: 'any_answer_2' }],
        date: new Date()
    },
    {
        id: 'other_id',
        question: 'other_question',
        answers: [{ answer: 'other_answer', image: 'other_image' }, { answer: 'other_answer_2' }],
        date: new Date()
    }
])

const makeLoadSurveysStub = (): LoadSurveys => {
    class LoadSurveysStub implements LoadSurveys {
        async load(): Promise<SurveyModel[]> {
            return Promise.resolve(makeFakesurveys())
        }
    }

    return new LoadSurveysStub()
}

const makeSut = (): SutTypes => {
    const loadSurveysStub = makeLoadSurveysStub()
    const sut = new LoadSurveysController(loadSurveysStub)

    return { sut, loadSurveysStub }
}

describe('LoadSurveys Controller', () => {
    beforeAll(() => {
        Mockdate.set(new Date())
    });

    afterAll(() => {
        Mockdate.reset()
    });

    test('should call LoadSurveys correctly', async () => {
        const { sut, loadSurveysStub} = makeSut()
        const loadSpy = jest.spyOn(loadSurveysStub, 'load')
        await sut.handle({})
        expect(loadSpy).toHaveBeenCalled()
    });

    test('should return 500 if LoadSurveys throws', async () => {
        const { sut, loadSurveysStub } = makeSut()
        jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(serverError(new Error()))
    });

    test('should return 204 if LoadSurveys returns empty', async () => {
        const { sut, loadSurveysStub } = makeSut()
        jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(noContent())
    });

    test('should return 200 on success', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({})
        expect(httpResponse).toEqual(ok(makeFakesurveys()))
    });
});