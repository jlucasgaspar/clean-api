import { badRequest } from '../../../helpers'
import { Controller, HttpRequest, HttpResponse, Validation } from '../../../protocols'

export class AddSurveyController implements Controller {
    constructor(private readonly validation: Validation) {}

    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const error = this.validation.validate(httpRequest.body)

        if (error) {
            return new Promise(res => res(badRequest(error))) // FIXME
        }

        return new Promise(res => res(null))
    }
}