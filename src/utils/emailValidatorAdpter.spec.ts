import { EmailValidatorAdpter } from './emailValidator'

describe('EmailValidatorAdpter', () => {
  test('Should return false if EmailValidator returns false', async () => {
    const sut = new EmailValidatorAdpter()

    const isValid = sut.isValid('invalidEmail@mail.com')
    expect(isValid).toBe(false)
  })
})
