export interface AuthModel {
    email: string
    password: string
}

export interface Authentication {
    auth(authData: AuthModel): Promise<string>
}