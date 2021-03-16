import { LoadSurveysController } from '@/presentation/controllers/Survey/LoadSurveys/LoadSurveysController';
import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerDecoratorFactory';
import { makeDbLoadSurveys } from '@/main/factories/useCases/survey/loadSurveys/DbLoadSurveysFactory';

export const makeLoadSurveysController = (): Controller => {
    const loadSurveysUseCase = makeDbLoadSurveys()
    const loadSurveysController = new LoadSurveysController(loadSurveysUseCase)
    return makeLogControllerDecorator(loadSurveysController)
}