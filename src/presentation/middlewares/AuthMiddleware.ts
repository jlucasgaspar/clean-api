import { HttpRequest, HttpResponse } from './../protocols/Http';
import { Middleware } from '../protocols/Middleware';
import { forbidden, ok, serverError } from '../helpers';
import { AccessDenied } from '../errors';
import { LoadAccountByToken } from '../../domain/useCases/LoadAccountByToken';

export class AuthMiddleware implements Middleware {
    constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const accessToken = httpRequest.headers?.['x-access-token']

            if (!accessToken) {
                return forbidden(new AccessDenied())
            }

            const account = await this.loadAccountByToken.load(accessToken)

            if (!account) {
                return forbidden(new AccessDenied())
            }

            return ok({ accountId: account.id });
        } catch (error) {
            return serverError(error)
        }
    }
}