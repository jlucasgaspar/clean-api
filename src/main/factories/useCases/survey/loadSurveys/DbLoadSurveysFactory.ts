import { SurveyMongoRepository } from '@/infra/db/mongodb/surveyRepository/SurveyMongoRepository'
import { DbLoadSurveys } from '@/data/useCases/LoadSurveys/DbLoadSurveys'
import { LoadSurveys } from '@/domain/useCases/LoadSurveys'

export const makeDbLoadSurveys = (): LoadSurveys => {
    const surveyMongoRepository = new SurveyMongoRepository()

    return new DbLoadSurveys(surveyMongoRepository)
}