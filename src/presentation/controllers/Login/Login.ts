import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, serverError } from '../../helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../SignUp/SignUpProtocols'
import { Authentication } from '../../../domain/useCases/Authentication'

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator
    private readonly authentication: Authentication

    constructor(emailValidator: EmailValidator, authentication: Authentication) {
        this.emailValidator = emailValidator
        this.authentication = authentication
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const requiredFields = ['email', 'password']

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            const { email, password } = httpRequest.body
    
            const isValid = this.emailValidator.isValid(email)
    
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }

            const token = await this.authentication.auth(email, password)
        } catch (error) {
            return serverError(error)            
        }
    }
}