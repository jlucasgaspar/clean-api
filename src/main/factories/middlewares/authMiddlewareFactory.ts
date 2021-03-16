import { AuthMiddleware } from "../../../presentation/middlewares/AuthMiddleware";
import { Middleware } from "../../../presentation/protocols";
import { makeDbLoadAccountByToken } from "../useCases/account/loadAccountByToken/DbLoadAccountByTokenFactory";

export const makeAuthMiddleware = (role?: string): Middleware => {
    const loadAccountByToken = makeDbLoadAccountByToken()

    return new AuthMiddleware(loadAccountByToken, role)
}