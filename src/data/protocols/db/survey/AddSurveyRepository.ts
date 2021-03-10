import { AddSurveyModel } from '../../../../domain/useCases/AddSurvey';

export interface AddSurveyRepository {
    add(surveyData: AddSurveyModel): Promise<void> 
}