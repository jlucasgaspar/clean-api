import { HttpRequest, HttpResponse } from './../protocols/Http';
import { Middleware } from '../protocols/Middleware';
import { forbidden } from '../helpers';
import { AccessDenied } from '../errors';

export class AuthMiddleware implements Middleware {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return Promise.resolve(forbidden(new AccessDenied()))
    }
}