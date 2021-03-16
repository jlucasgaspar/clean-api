import jwt from 'jsonwebtoken'
import { Decrypter } from '@/data/protocols/cryptography/Decrypter'
import { Encrypter } from '@/data/protocols/cryptography/Encrypter'

export class JwtAdapater implements Encrypter, Decrypter {
    constructor(private readonly secretKey: string) {}

    async encrypt(value: string): Promise<string> {
        const accessToken = await jwt.sign({ id: value }, this.secretKey)
        return accessToken
    }

    async decrypt(token: string): Promise<string> {
        return jwt.verify(token, this.secretKey) as any
    }
}