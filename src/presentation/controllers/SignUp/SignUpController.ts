import { HttpRequest, HttpResponse, Controller, AddAccount, Validation } from './SignUpProtocols'
import { InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers'
import { EmailValidator } from '../../protocols/EmailValidator'

export class SignUpController implements Controller {
    private readonly addAccount: AddAccount
    private readonly validation: Validation
    private readonly emailValidator: EmailValidator

    constructor(emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
        this.addAccount = addAccount
        this.validation = validation
        this.emailValidator = emailValidator
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body)

            if (error) {
                return badRequest(error)
            }

            const { name, email, password } = httpRequest.body

            const account = await this.addAccount.add({ name, email, password })

            return ok(account)
        } catch (err) {
            return serverError(err)
        }
    }
}