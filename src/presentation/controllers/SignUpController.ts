import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/MissingParamError'
import { badRequest } from '../helpers/httpHelper'

export class SignUpController {
    public handle(httpRequest: HttpRequest): HttpResponse {
        const requiredFields = ['name', 'email']

        for (const field of requiredFields) {
            if (!httpRequest.body[field]) {{
                return badRequest(new MissingParamError(field))
            }}
        }
    }
}