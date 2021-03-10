import { AddSurvey, AddSurveyModel } from '../../../domain/useCases/AddSurvey';
import { AddSurveyRepository } from '../../protocols/db/survey/AddSurveyRepository';

export class DbAddSurvey implements AddSurvey {
    constructor(private readonly addSurveyRepository: AddSurveyRepository) {}
    
    async add(surveyData: AddSurveyModel): Promise<void> {
        await this.addSurveyRepository.add(surveyData)
        
        return new Promise(resolve => resolve())
    }
}