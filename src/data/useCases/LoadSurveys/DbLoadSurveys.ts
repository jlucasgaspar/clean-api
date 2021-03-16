import { LoadSurveysRepository } from './../../protocols/db/survey/LoadSurveyRepository';
import { SurveyModel } from '../../../domain/models/Survey';
import { LoadSurveys } from './../../../domain/useCases/LoadSurveys';
export class DbLoadSurveys implements LoadSurveys {
    constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

    async load(): Promise<SurveyModel[]> {
        const surveys = await this.loadSurveysRepository.loadAll()
        
        return surveys
    }
}