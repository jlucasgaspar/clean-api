import jwt from 'jsonwebtoken'
import { JwtAdapater } from './JwtAdapater'

describe('JWT Adapater', () => {
    test('Should call sign with corrects values', async () => {
        const sut = new JwtAdapater('secret_key')
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')
        expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret_key')
    })
})