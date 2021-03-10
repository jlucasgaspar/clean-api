import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols'

export class AddSurveyController implements Controller {
    constructor(private readonly validation: Validation) {}

    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        this.validation.validate(httpRequest)

        return new Promise(res => res(null))
    }
}