import jwt from 'jsonwebtoken'
import { Encrypter } from "../../../data/protocols/cryptography/Encrypter"

export class JwtAdapater implements Encrypter {
    constructor(private readonly secretKey: string) {}

    async encrypt(value: string): Promise<string> {
        const accessToken = await jwt.sign({ id: value }, this.secretKey)
        return accessToken
    }
}