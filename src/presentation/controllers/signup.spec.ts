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
        name: 'anyName',
        password: 'anyPass',
        passwordConfirmation: 'anyPass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'anyEmail@anyEmail.com',
        passwordConfirmation: 'anyPass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissinParamError('password'))
  })
})
