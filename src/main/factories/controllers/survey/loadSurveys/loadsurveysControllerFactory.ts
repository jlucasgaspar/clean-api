import { LoadSurveysController } from '../../../../../presentation/controllers/Survey/LoadSurveys/LoadSurveysController';
import { Controller } from '../../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../../decorators/logControllerDecoratorFactory';
import { makeDbLoadSurveys } from '../../../useCases/survey/loadSurveys/DbLoadSurveysFactory';

export const makeLoadSurveysController = (): Controller => {
    const loadSurveysUseCase = makeDbLoadSurveys()
    const loadSurveysController = new LoadSurveysController(loadSurveysUseCase)
    return makeLogControllerDecorator(loadSurveysController)
}