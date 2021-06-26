import {
  EmailValidator,
  HttpResponse,
  HttpRequest,
  Controller,
  AddAccount
} from './signupProtocols'

import { InvalidParamError, MissinParamError } from '../../errors'

import { badRequest, serverError, ok } from '../../helpers/http'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

      const account = await this.addAccount.add({ name, email, password })

      return ok(account)
    } catch {
      return serverError()
    }
  }
}
