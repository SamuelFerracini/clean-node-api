import { EmailValidatorAdpter } from './emailValidatorAdpter'

import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdpter => {
  return new EmailValidatorAdpter()
}

describe('EmailValidatorAdpter', () => {
  test('Should return false if EmailValidator returns false', async () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalidEmail@mail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if EmailValidator returns true', async () => {
    const sut = makeSut()

    const isValid = sut.isValid('validEmail@mail.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', async () => {
    const sut = makeSut()

    sut.isValid('anyEmail@mail.com')
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    expect(isEmailSpy).toHaveBeenCalledWith('anyEmail@mail.com')
  })
})
