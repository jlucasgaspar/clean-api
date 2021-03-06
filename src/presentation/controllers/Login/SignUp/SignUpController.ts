import { HttpRequest, HttpResponse, Controller, AddAccount, Validation } from './SignUpControllerProtocols'
import { badRequest, serverError, ok, forbidden } from '@/presentation/helpers'
import { Authentication } from '@/domain/useCases/Authentication'
import { EmailInUseError } from '@/presentation/errors'

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

            const account = await this.addAccount.add({ name, email, password })

            if (!account) {
                return forbidden(new EmailInUseError())
            }

            const accessToken = await this.authentication.auth({ email, password })

            return ok({ accessToken })
        } catch (err) {
            console.error(err)
            return serverError(err)
        }
    }
}