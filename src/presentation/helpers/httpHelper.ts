import { HttpResponse } from "../protocols/Http"

export const badRequest = (err: Error): HttpResponse => ({ statusCode: 400, body: err })