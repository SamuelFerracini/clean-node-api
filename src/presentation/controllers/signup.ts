import {
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse
} from '../protocols'

import { InvalidParamError, MissinParamError } from '../errors'

import { badRequest, serverError } from '../helpers/http'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      const { body } = httpRequest

      for (const field of requiredFields)
        if (!body[field]) return badRequest(new MissinParamError(field))

      if (!this.emailValidator.isValid(body.email))
        return badRequest(new InvalidParamError('email'))
    } catch {
      return serverError()
    }
  }
}
