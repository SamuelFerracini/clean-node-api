import {
  AddAccountRepository,
  AddAccountModel,
  AccountModel,
  Encrypter
} from './dbAddAccountProtocols'

import { DbAddAccount } from './dbAddAccount'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'validId',
        name: 'validName',
        email: 'validEmail',
        password: 'hashedPassword'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
}
const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashedPassword'))
    }
  }

  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const accountData = {
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }

    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('validPassword')
  })

  test('Should throw if Encrypter throws', async () => {
    const accountData = {
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }

    const { sut, encrypterStub } = makeSut()

    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const accountData = {
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }

    const { sut, addAccountRepositoryStub } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: 'hashedPassword'
    })
  })
})
