import { LoadSurveysRepository } from '@/data/protocols/db/survey/LoadSurveyRepository';
import { AddSurveyModel } from '@/domain/useCases/AddSurvey';
import { AddSurveyRepository } from '@/data/protocols/db/survey/AddSurveyRepository';
import { MongoHelper } from '../helpers/mongoHelper';
import { SurveyModel } from '@/domain/models/Survey';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
    async add(surveyData: AddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection('surveys')

        await surveyCollection.insertOne(surveyData)
    }

    async loadAll(): Promise<SurveyModel[]> {
        const surveyCollection = await MongoHelper.getCollection('surveys')

        const surveys: SurveyModel[] = await surveyCollection.find().toArray()

        return surveys
    }
}