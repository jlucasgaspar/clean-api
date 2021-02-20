import { HttpResponse } from "../protocols/http"

export const badRequest = (err: Error): HttpResponse => ({ statusCode: 400, body: err })