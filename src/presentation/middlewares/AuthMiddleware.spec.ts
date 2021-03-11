import { LoadAccountByToken } from './../../domain/useCases/LoadAccountByToken';
import { AuthMiddleware } from './AuthMiddleware';
import { forbidden } from './../helpers/http/httpHelper';
import { AccessDenied } from '../errors';
import { HttpRequest } from '../protocols';
import { AccountModel } from '../../domain/models/Account';

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
        return Promise.resolve(makeFakeAccount())
    }
}

describe('Auth Middleware', () => {
    test('should return 403 if no x-access-token exists in headers', async () => {
        const loadAccountByTokenStub = new LoadAccountByTokenStub();
        const sut = new AuthMiddleware(loadAccountByTokenStub);
        const httpResponse = await sut.handle({}); //const httpRequest: HttpRequest = { headers: {}}
        expect(httpResponse).toEqual(forbidden(new AccessDenied()));
    });

    test('should call LoadAccountByToken with corect accessToken', async () => {
        const loadAccountByTokenStub = new LoadAccountByTokenStub();
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        const httpRequest: HttpRequest = { headers: { 'x-access-token': 'any_token' }}
        const sut = new AuthMiddleware(loadAccountByTokenStub);
        await sut.handle(httpRequest);
        expect(loadSpy).toHaveBeenCalledWith('any_token');
    });
});