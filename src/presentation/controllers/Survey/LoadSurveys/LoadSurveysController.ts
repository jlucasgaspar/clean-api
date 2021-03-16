import { LoadSurveys } from '../../../../domain/useCases/LoadSurveys';
import { ok } from '../../../helpers';
import { Controller, HttpRequest, HttpResponse } from '../../../protocols';

export class LoadSurveysController implements Controller {
    constructor(private readonly loadSurveys: LoadSurveys) {}
    
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const surveys = await this.loadSurveys.load()

        return ok(surveys)
    }
}