import { HttpRequest, HttpResponse } from '../protocols/http'

import { MissinParamError } from '../errors/missingParamError'

import { badRequest } from '../helpers/http'
export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest
    const { name, email } = body

    if (!name) return badRequest(new MissinParamError('name'))

    if (!email) return badRequest(new MissinParamError('email'))
  }
}
