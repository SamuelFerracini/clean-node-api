import { HttpRequest, HttpResponse } from '../protocols/http'

import { MissinParamError } from '../errors/missingParamError'

import { badRequest } from '../helpers/http'
export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    const { body } = httpRequest

    for (const field of requiredFields)
      if (!body[field]) return badRequest(new MissinParamError(field))
  }
}
