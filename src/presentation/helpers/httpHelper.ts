import { HttpResponse } from "../protocols"
import { ServerError } from '../errors'

export const badRequest = (err: Error): HttpResponse => ({ statusCode: 400, body: err })
export const serverError = (): HttpResponse => ({ statusCode: 500, body: new ServerError() })