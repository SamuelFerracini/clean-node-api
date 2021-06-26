import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest
    const { name, email } = body

    if (!name)
      return { statusCode: 400, body: new Error('Missing param: name') }

    if (!email)
      return { statusCode: 400, body: new Error('Missing param: email') }
  }
}
