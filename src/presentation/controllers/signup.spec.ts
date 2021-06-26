import { SignUpController } from './signup'

import { MissinParamError } from '../errors/missingParamError'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        email: 'anyEmail@anyEmail.com',
        password: 'anyPass',
        passwordConfirmation: 'anyPass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('email'))
  })
})
