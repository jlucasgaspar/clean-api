import jwt from 'jsonwebtoken'
import { JwtAdapater } from './JwtAdapater'

jest.mock('jsonwebtoken', () => ({
    sign: async (): Promise<string> => {
        return new Promise(resolve => resolve('any_token'))
    }
}))

describe('JWT Adapater', () => {
    test('Should call sign with corrects values', async () => {
        const sut = new JwtAdapater('secret_key')
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')
        expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret_key')
    })

    test('Should return a token on sign success', async () => {
        const sut = new JwtAdapater('secret_key')
        const accessToken = await sut.encrypt('any_id')
        expect(accessToken).toBe('any_token')
    })
})