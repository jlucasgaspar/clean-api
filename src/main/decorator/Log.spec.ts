import { LogControllerDecorator } from './Log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
            statusCode: 200,
            body: httpRequest
        }

        return new Promise(resolve => resolve(httpResponse))
    }
}

describe('LogController Decorator', () => {
    test('Should call handle method', async () => {
        const controllerStub = new ControllerStub()
        const sut = new LogControllerDecorator(controllerStub)

        const handleSpy = jest.spyOn(controllerStub, 'handle')

        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_passwordConfirmation'
            }
        }

        await sut.handle(httpRequest)

        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })
})