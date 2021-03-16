import { SurveyAnswerModel } from '@/domain/models/Survey';


export interface AddSurveyModel {
    question: string
    answers: SurveyAnswerModel[]
    date: Date
}

export interface AddSurvey {
    add(data: AddSurveyModel): Promise<void>
}