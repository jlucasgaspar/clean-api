import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongoHelper'
import { SurveyMongoRepository } from './SurveyMongoRepository'

const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
}

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        surveyCollection = await MongoHelper.getCollection('surveys')
        await surveyCollection.deleteMany({})
    })

    describe('add()', () => {
        test('Should return null on add survey success', async () => {
            const sut = makeSut()

            await sut.add({
                question: 'any_question',
                answers: [{ answer: 'any_answer', image: 'any_image' }, { answer: 'any_answer_2' }],
                date: new Date()
            })

            const survey = await surveyCollection.findOne({ question: 'any_question' })

            expect(survey).toBeTruthy()
        })
    })

    describe('loadAll()', () => {
        test('should load all surveys on success', async () => {
            await surveyCollection.insertMany([
                {
                    question: 'any_question',
                    answers: [{ answer: 'any_answer', image: 'any_image' }, { answer: 'any_answer_2' }],
                    date: new Date()
                },
                {
                    question: 'other_question',
                    answers: [{ answer: 'other_answer', image: 'other_image' }, { answer: 'other_answer_2' }],
                    date: new Date()
                }
            ])
            const sut = makeSut()
            const surveys = await sut.loadAll()
            expect(surveys.length).toBe(2)
            expect(surveys).toHaveLength(2)
        });
    })
})