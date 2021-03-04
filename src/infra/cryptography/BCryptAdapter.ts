import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/cryptography/Hasher'

export class BcryptAdapter implements Hasher {
    private readonly salt: number

    constructor(salt: number) {
        this.salt = salt
    }

    async hash(value: string): Promise<string> {
        const hashedValue = await bcrypt.hash(value, this.salt)

        return hashedValue
    }
}