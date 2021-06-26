export class SignUpController {
  handle(httpRequest: any): any {
    const { body } = httpRequest
    const { name, email } = body

    if (!name)
      return { statusCode: 400, body: new Error('Missing param: name') }

    if (!email)
      return { statusCode: 400, body: new Error('Missing param: email') }
  }
}
