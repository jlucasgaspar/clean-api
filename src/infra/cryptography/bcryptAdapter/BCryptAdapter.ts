import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/cryptography/HashComparer'
import { Hasher } from '../../../data/protocols/cryptography/Hasher'

export class BcryptAdapter implements Hasher, HashComparer {
    private readonly salt: number

    constructor(salt: number) {
        this.salt = salt
    }

    async hash(value: string): Promise<string> {
        const hashedValue = await bcrypt.hash(value, this.salt)

        return hashedValue
    }

    async compare(value: string, hashedValue: string): Promise<boolean> {
        const isValid = await bcrypt.compare(value, hashedValue)

        return isValid
    }
}