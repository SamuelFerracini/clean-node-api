import { HttpRequest, HttpResponse } from '../protocols/http'

import { MissinParamError } from '../errors/missingParamError'

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest
    const { name, email } = body

    if (!name) return { statusCode: 400, body: new MissinParamError('name') }

    if (!email) return { statusCode: 400, body: new MissinParamError('email') }
  }
}
