import { HttpResponse } from '../protocols'
import { ServerError, UnauthorizedError } from '../errors'

export const badRequest = (err: Error): HttpResponse => ({
    statusCode: 400,
    body: err
})

export const unauthorized = (): HttpResponse => ({
    statusCode: 401,
    body: new UnauthorizedError()
})

export const serverError = (err: Error): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(err.stack)
})

export const ok = (data: any): HttpResponse => ({
    statusCode: 200,
    body: data
})
