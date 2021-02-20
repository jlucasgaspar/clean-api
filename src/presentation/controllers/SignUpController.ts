import { HttpRequest, HttpResponse } from '../protocols/Http'
import { Controller } from '../protocols/controller'
import { MissingParamError } from '../errors/MissingParamError'
import { badRequest } from '../helpers/httpHelper'

export class SignUpController implements Controller {
    handle(httpRequest: HttpRequest): HttpResponse {
        const requiredFields = ['name', 'email', 'password', 'confirmPassword']

        for (const field of requiredFields) {
            if (!httpRequest.body[field]) {{
                return badRequest(new MissingParamError(field))
            }}
        }
    }
}