import { HttpResponse } from "../protocols/Http"
import { ServerError } from '../errors/ServerError'

export const badRequest = (err: Error): HttpResponse => ({ statusCode: 400, body: err })
export const serverError = (): HttpResponse => ({ statusCode: 500, body: new ServerError() })