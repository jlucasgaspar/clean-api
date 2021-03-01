import { LogControllerDecorator } from './Log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { serverError } from '../../presentation/helpers'
import { LogErrorRepository } from '../../data/protocols/LogErrorRepository'

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
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

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async log(stackError: string): Promise<void> {
            return new Promise(resolve => resolve())
        }
    }

    return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
    const logErrorRepositoryStub = makeLogErrorRepositoryStub()
    const controllerStub = makeControllerStub()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
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

    test('Should return the same result of the intern controller', async () => {
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_passwordConfirmation'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual({
            statusCode: 200,
            body: httpRequest
        })
    })

    test('Should call LogErrorRepository with correct error if controller returns a ServerError', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

        const fakeError = new Error()
        fakeError.stack = 'any_stack'

        const error = serverError(fakeError)

        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))

        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_passwordConfirmation'
            }
        }

        await sut.handle(httpRequest)

        expect(logSpy).toHaveBeenCalledWith(fakeError.stack) // 'any_stack'
    })
})