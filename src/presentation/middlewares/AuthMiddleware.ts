import { HttpRequest, HttpResponse } from './../protocols/Http';
import { Middleware } from '../protocols/Middleware';
import { forbidden } from '../helpers';
import { AccessDenied } from '../errors';
import { LoadAccountByToken } from '../../domain/useCases/LoadAccountByToken';

export class AuthMiddleware implements Middleware {
    constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const accessToken = httpRequest.headers?.['x-access-token']

        if (!accessToken) {
            return forbidden(new AccessDenied())
        }

        await this.loadAccountByToken.load(accessToken)
    }
}