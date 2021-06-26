import {
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse
} from '../protocols'

import { InvalidParamError, MissinParamError } from '../errors'

import { badRequest, serverError } from '../helpers/http'
import { AddAccount } from '../../domain/useCases'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      const { body } = httpRequest

      const { name, email, password, passwordConfirmation } = body

      for (const field of requiredFields)
        if (!body[field]) return badRequest(new MissinParamError(field))

      if (password !== passwordConfirmation)
        return badRequest(new InvalidParamError('passwordConfirmation'))

      if (!this.emailValidator.isValid(email))
        return badRequest(new InvalidParamError('email'))

      this.addAccount.add({ name, email, password })
    } catch {
      return serverError()
    }
  }
}
