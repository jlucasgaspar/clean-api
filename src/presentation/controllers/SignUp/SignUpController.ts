import { HttpRequest, HttpResponse, Controller, AddAccount, Validation } from './SignUpControllerProtocols'
import { badRequest, serverError, ok } from '../../helpers'
import { Authentication } from '../../../domain/useCases/Authentication'

export class SignUpController implements Controller {
    constructor(
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)

            if (error) {
                return badRequest(error)
            }

            const { name, email, password } = httpRequest.body

            await this.addAccount.add({ name, email, password })

            const accessToken = await this.authentication.auth({ email, password });

            return ok({ accessToken })
        } catch (err) {
            console.error(err)
            return serverError(err)
        }
    }
}