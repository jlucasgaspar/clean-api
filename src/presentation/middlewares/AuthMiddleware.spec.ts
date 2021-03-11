import { LoadAccountByToken } from './../../domain/useCases/LoadAccountByToken';
import { AuthMiddleware } from './AuthMiddleware';
import { forbidden } from './../helpers/http/httpHelper';
import { AccessDenied } from '../errors';
import { HttpRequest } from '../protocols';
import { AccountModel } from '../../domain/models/Account';

interface SutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
}

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeFakeRequestHeaders = (): HttpRequest => ({ headers: { 'x-access-token': 'any_token' } })

const makeLoadAccountByTokenStub = () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
        async load(accessToken: string, role?: string): Promise<AccountModel> {
            return Promise.resolve(makeFakeAccount())
        }
    }

    return new LoadAccountByTokenStub();
}

const makeSut = (): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub);

    return { loadAccountByTokenStub, sut }
}



describe('Auth Middleware', () => {
    test('should return 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({}); //const httpRequest: HttpRequest = { headers: {}}
        expect(httpResponse).toEqual(forbidden(new AccessDenied()));
    });

    test('should call LoadAccountByToken with corect accessToken', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
        await sut.handle(makeFakeRequestHeaders());
        expect(loadSpy).toHaveBeenCalledWith('any_token');
    });
});