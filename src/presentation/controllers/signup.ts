import { HttpRequest, HttpResponse } from '../protocols/http'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/emailValidator'

import { MissinParamError } from '../errors/missingParamError'

import { badRequest } from '../helpers/http'
import { InvalidParamError } from '../errors/invalidParamError'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    const { body } = httpRequest

    for (const field of requiredFields)
      if (!body[field]) return badRequest(new MissinParamError(field))

    if (!this.emailValidator.isValid(body.email))
      return badRequest(new InvalidParamError('email'))
  }
}
