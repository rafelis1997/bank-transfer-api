import { FakeHasher } from '@/tests/cryptography/fake-hasher'
import { InMemoryClientRepository } from '@/tests/repositories/in-memory-client-repository'
import { RegisterClientUseCase } from './register-client'
import { ClientAlreadyExistsError } from '../errors/client-already-exists-error'
import { InMemoryBalanceRepository } from '@/tests/repositories/in-memory-balance-repository'
import { DocumentIsInvalidError } from '../errors/document-is-invalid'
import { ClientType } from '@/domain/wallet/enterprise/entities/common'

let inMemoryClientRepository: InMemoryClientRepository
let inMemoryBalanceRepository: InMemoryBalanceRepository
let fakeHasher: FakeHasher
let sut: RegisterClientUseCase

describe('Register client use case', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    inMemoryBalanceRepository = new InMemoryBalanceRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterClientUseCase(
      inMemoryClientRepository,
      inMemoryBalanceRepository,
      fakeHasher,
    )
  })

  it('should be able to register individual client', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      document: '69953072086',
      type: ClientType.INDIVIDUAL,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      client: inMemoryClientRepository.items[0],
    })
  })

  it('should be able to register company client', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      document: '10957686000167',
      type: ClientType.COMPANY,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      client: inMemoryClientRepository.items[0],
    })
  })

  it('should not be able to register client with same email', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      document: '69953072086',
      type: ClientType.INDIVIDUAL,
      password: '123456',
    })

    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      document: '32967175013',
      type: ClientType.INDIVIDUAL,
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientAlreadyExistsError)
  })

  it('should not be able to register client with same document', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      document: '27110042014',
      type: ClientType.INDIVIDUAL,
      password: '123456',
    })

    const result = await sut.execute({
      name: 'John Doe',
      email: 'john2@doe.com',
      document: '27110042014',
      type: ClientType.INDIVIDUAL,
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientAlreadyExistsError)
  })

  it('should not be able to register client with invalid cpf', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john2@doe.com',
      document: '27110042013',
      type: ClientType.INDIVIDUAL,
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DocumentIsInvalidError)
  })
})
