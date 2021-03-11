import { AuthMiddleware } from './AuthMiddleware';
import { forbidden } from './../helpers/http/httpHelper';
import { AccessDenied } from '../errors';

describe('Auth Middleware', () => {
    test('should return 403 if no x-access-token exists in headers', async () => {
        //const httpRequest: HttpRequest = { headers: {}}
        const sut = new AuthMiddleware();
        const httpResponse = await sut.handle({});
        expect(httpResponse).toEqual(forbidden(new AccessDenied()));
    });
});