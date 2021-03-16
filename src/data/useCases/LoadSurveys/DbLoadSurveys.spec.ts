import { DbLoadSurveys } from './DbLoadSurveys';
import { SurveyModel } from '../../../domain/models/Survey';
import { LoadSurveysRepository } from './../../protocols/db/survey/LoadSurveyRepository';

interface SutTypes {
    sut: DbLoadSurveys
    loadSurveysRepositoryStub: LoadSurveysRepository
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

const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
        loadAll(): Promise<SurveyModel[]> {
            return Promise.resolve(makeFakesurveys())
        }
    }
    return new LoadSurveysRepositoryStub()
}

const makeSut = (): SutTypes => {
    const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub()
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

    return { loadSurveysRepositoryStub, sut }
}

describe('DbLoadSurveys UseCase', () => {
    test('should call LoadSurveysRepository correctly', async () => {
        const { loadSurveysRepositoryStub, sut } = makeSut()
        const laodSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
        await sut.load()
        expect(laodSpy).toHaveBeenCalled()
    });
});