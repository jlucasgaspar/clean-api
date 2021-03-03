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
            const { email, password } = httpRequest.body
    
            if (!email) {
                return badRequest(new MissingParamError('email'))
            }
    
            if (!password) {
                return badRequest(new MissingParamError('password'))
            }
    
            const isValid = this.emailValidator.isValid(email)
    
            if (!isValid) {
                return badRequest(new InvalidParamError('email'))
            }

            const token = await this.authentication.auth(email, password)
    
            return new Promise(resolve => resolve(null))
        } catch (error) {
            return serverError(error)            
        }
    }
}