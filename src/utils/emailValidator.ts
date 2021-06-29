import { EmailValidator } from '../presentation/protocols/emailValidator'

export class EmailValidatorAdpter implements EmailValidator {
  isValid(email: string): boolean {
    return false
  }
}
