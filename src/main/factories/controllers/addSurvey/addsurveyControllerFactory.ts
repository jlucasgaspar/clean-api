import { AddSurveyController } from './../../../../presentation/controllers/Survey/AddSurvey/AddSurveyController';
import { Controller } from '../../../../presentation/protocols';
import { makeLogControllerDecorator } from '../../decorators/logControllerDecoratorFactory';
import { makeAddSurveyValidation } from './addSurveyValidationFactory';
import { makeDbAddSurvey } from '../../useCases/addSurvey/DbAddSurveyFactory';

export const makeAddSurveyController = (): Controller => {
    const addSurveyController = new AddSurveyController(
        makeAddSurveyValidation(),
        makeDbAddSurvey()
    )

    return makeLogControllerDecorator(addSurveyController)
}