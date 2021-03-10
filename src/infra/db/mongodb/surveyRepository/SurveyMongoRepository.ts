import { AddSurveyModel } from '../../../../domain/useCases/AddSurvey';
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/AddSurveyRepository';
import { MongoHelper } from '../helpers/mongoHelper';

export class SurveyMongoRepository implements AddSurveyRepository {
    async add(surveyData: AddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection('surveys')

        await surveyCollection.insertOne(surveyData)
    }
}