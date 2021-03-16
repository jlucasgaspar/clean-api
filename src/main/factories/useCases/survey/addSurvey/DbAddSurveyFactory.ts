import { SurveyMongoRepository } from '@/infra/db/mongodb/surveyRepository/SurveyMongoRepository'
import { DbAddSurvey } from '@/data/useCases/AddSurvey/DbAddSurvey'
import { AddSurvey } from '@/domain/useCases/AddSurvey'

export const makeDbAddSurvey = (): AddSurvey => {
    const surveyMongoRepository = new SurveyMongoRepository()

    return new DbAddSurvey(surveyMongoRepository)
}