import {
  AddAccountRepository,
  AddAccountModel,
  AccountModel,
  AddAccount,
  Encrypter
} from './dbAddAccountProtocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)

    await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword })
    )
    return new Promise(resolve => resolve(null))
  }
}
