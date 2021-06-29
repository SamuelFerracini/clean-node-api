import { AccountModel } from '../../domain/models'
import { AddAccountModel } from '../../domain/useCases'

export interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>
}
