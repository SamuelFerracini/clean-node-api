import { MissinParamError, InvalidParamError, ServerError } from '../../errors'

import { SignUpController } from './signup'

import {
  AddAccountModel,
  EmailValidator,
  AccountModel,
  AddAccount
} from './signupProtocols'

interface SutTypes {
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  sut: SignUpController
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const { name, email, password } = account

      const fakeAccount = {
        id: 'validId',
        name,
        email,
        password
      }

      return fakeAccount
    }
  }

  return new AddAccountStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()

  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    emailValidatorStub,
    addAccountStub,
    sut
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()

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
    const { sut } = makeSut()

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
    const { sut } = makeSut()

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

  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'anyEmail@anyEmail.com',
        password: 'anyPass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissinParamError('passwordConfirmation')
    )
  })

  test('Should return 400 if password confirmation fails', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'anyEmail@anyEmail.com',
        password: 'anyPass',
        passwordConfirmation: 'invalidPassword'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    )
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'invalid@invalid.com',
        password: 'anyPass',
        passwordConfirmation: 'anyPass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'invalid@invalid.com',
        password: 'anyPass',
        passwordConfirmation: 'anyPass'
      }
    }

    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('invalid@invalid.com')
  })

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'anyEmail@anyEmail.com',
        password: 'anyPass',
        passwordConfirmation: 'anyPass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const accountPayload = {
      name: 'anyName',
      email: 'invalid@invalid.com',
      password: 'anyPass'
    }

    const httpRequest = {
      body: {
        ...accountPayload,
        passwordConfirmation: 'anyPass'
      }
    }

    sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith(accountPayload)
  })

  test('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'anyName',
        email: 'anyEmail@anyEmail.com',
        password: 'anyPass',
        passwordConfirmation: 'anyPass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if valid data is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'validName',
        email: 'validEmail@validEmail.com',
        password: 'validPass',
        passwordConfirmation: 'validPass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'validId',
      name: 'validName',
      email: 'validEmail@validEmail.com',
      password: 'validPass'
    })
  })
})
