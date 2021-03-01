import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { LoginController } from './Login'

describe('LoginController', () => {
    test('Should return 400 if no email is provided', async () => {
        const sut = new LoginController()

        const httpRequest = {
            body: {
                //email: '',
                password: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    test('Should return 400 if no password is provided', async () => {
        const sut = new LoginController()

        const httpRequest = {
            body: {
                email: 'any_email@mail.com',
                //password: 'any_password'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })
})