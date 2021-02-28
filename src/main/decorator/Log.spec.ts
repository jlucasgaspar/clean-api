import { LogControllerDecorator } from './Log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
}

const makeControllerStub = (): Controller => {
    class ControllerStub implements Controller {
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse: HttpResponse = {
                statusCode: 200,
                body: httpRequest
            }
    
            return new Promise(resolve => resolve(httpResponse))
        }
    }

    return new ControllerStub()
}

const makeSut = (): SutTypes => {
    const controllerStub = makeControllerStub()
    const sut = new LogControllerDecorator(controllerStub)

    return {
        sut,
        controllerStub
    }
}

describe('LogController Decorator', () => {
    test('Should call handle method', async () => {
        const { controllerStub, sut } = makeSut()

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