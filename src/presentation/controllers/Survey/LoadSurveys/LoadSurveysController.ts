import { noContent } from '@/presentation/helpers/http/httpHelper';
import { LoadSurveys } from '@/domain/useCases/LoadSurveys';
import { ok, serverError } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class LoadSurveysController implements Controller {
    constructor(private readonly loadSurveys: LoadSurveys) {}
    
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const surveys = await this.loadSurveys.load()

            if (!surveys.length) {
                return noContent()
            }

            return ok(surveys)
        } catch (error) {
            return serverError(error)
        }
    }
}