import { AccountModel } from '../../../domain/models'

import { Encrypter } from '../../protocols/encrypter'

import {
  AddAccount,
  AddAccountModel
} from '../../../domain/useCases/addAccount'

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }
}
