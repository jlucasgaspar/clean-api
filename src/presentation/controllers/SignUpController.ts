import { EmailValidator } from '../protocols/EmailValidator'
import { HttpRequest, HttpResponse } from '../protocols/Http'
import { Controller } from '../protocols/controller'
import { InvalidParamError } from '../errors/InvalidParamError'
import { MissingParamError } from '../errors/MissingParamError'
import { badRequest, serverError } from '../helpers/httpHelper'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle(httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {{
                    return badRequest(new MissingParamError(field))
                }}
            }

            const isValid = this.emailValidator.isValid(httpRequest.body.email)
    
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }
        } catch (err) {
            //console.error(err)

            return serverError()
        }
    }
}