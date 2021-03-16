import jwt from 'jsonwebtoken'
import { JwtAdapater } from './JwtAdapater'

jest.mock('jsonwebtoken', () => ({
    async sign(): Promise<string> {
        return new Promise(resolve => resolve('any_token'))
    },

    async verify(token: string): Promise<string> {
        return Promise.resolve('any_value')
    }
}))

describe('JWT Adapater', () => {
    describe('sign()', () => {
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
    
        test('Should throw if sign throws', async () => {
            const sut = new JwtAdapater('secret_key')
            jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
                throw new Error()
            })
            const promise = sut.encrypt('any_id')
            await expect(promise).rejects.toThrow()
        })
    });

    describe('verify()', () => {
        test('Should call verify with corrects values', async () => {
            const sut = new JwtAdapater('secret_key')
            const verifySpy = jest.spyOn(jwt, 'verify')
            await sut.decrypt('any_token')
            expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret_key')
        })

        test('Should return a token on verify success', async () => {
            const sut = new JwtAdapater('secret_key')
            const value = await sut.decrypt('any_token')
            expect(value).toBe('any_value')
        })

        test('Should throw if verify throws', async () => {
            const sut = new JwtAdapater('secret_key')
            jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
                throw new Error()
            })
            const promise = sut.decrypt('any_id')
            await expect(promise).rejects.toThrow()
        })
    });
})