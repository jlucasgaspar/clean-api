import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { EmailValidator } from '../SignUp/SignUpControllerProtocols'
import { Authentication } from '@/domain/useCases/Authentication'

/**
 * @ATTENTION
 * Aqui no LoginController, não vou fazer o esquema de validation como no
 * SignUp Controller, pra poder ver como são as 2 formas no futuro.
*/

export class LoginController implements Controller {
    constructor(
        private readonly emailValidator: EmailValidator,
        private readonly authentication: Authentication
    ) {}

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

            const token = await this.authentication.auth({ email, password })

            if (!token) {
                return unauthorized()
            }

            return ok({ token: token });
        } catch (error) {
            return serverError(error)            
        }
    }
}