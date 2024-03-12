import { InMemoryBalanceRepository } from '@/tests/repositories/in-memory-balance-repository'
import { InMemoryClientRepository } from '@/tests/repositories/in-memory-client-repository'
import { InMemoryTransferRepository } from '@/tests/repositories/in-memory-transfer-repository'
import { FakeTransactionValidator } from '@/tests/validation/fake-transaction-validator'
import { CreateTransferUseCase } from './create-transfer'
import { makeClient } from '@/tests/factories/make-client'
import { makeBalance } from '@/tests/factories/make-balance'
import { ClientDoesNotExistsError } from '../errors/client-does-not-exists'
import { InsufficientBalanceError } from '../errors/insufficient-balance'
import { ClientType } from '@/domain/wallet/enterprise/entities/common'
import { UnauthorizedTransactionError } from '../errors/unauthorized-transaction'

let inMemoryBalanceRepository: InMemoryBalanceRepository
let inMemoryClientRepository: InMemoryClientRepository
let inMemoryTransferRepository: InMemoryTransferRepository
let fakeTransactionValidator: FakeTransactionValidator
let sut: CreateTransferUseCase

describe('Create transfer use case', () => {
  beforeEach(() => {
    inMemoryBalanceRepository = new InMemoryBalanceRepository()
    inMemoryClientRepository = new InMemoryClientRepository()
    inMemoryTransferRepository = new InMemoryTransferRepository()
    fakeTransactionValidator = new FakeTransactionValidator()
    sut = new CreateTransferUseCase(
      inMemoryTransferRepository,
      inMemoryBalanceRepository,
      inMemoryClientRepository,
      fakeTransactionValidator,
    )
  })

  it('should be able to make a transfer', async () => {
    const client1 = makeClient()
    const client2 = makeClient()

    inMemoryClientRepository.items.push(client1, client2)

    const balanceClient1 = makeBalance({
      holderId: client1.id,
    })
    const balanceClient2 = makeBalance({
      holderId: client2.id,
    })

    inMemoryBalanceRepository.items.push(balanceClient1, balanceClient2)

    const response = await sut.execute({
      amount: 1000,
      receiverId: client2.id.toString(),
      senderId: client1.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryTransferRepository.items).toHaveLength(1)
    expect(inMemoryTransferRepository.items[0]).toEqual(
      expect.objectContaining({
        amount: 1000,
        receiverId: client2.id.toString(),
        senderId: client1.id.toString(),
      }),
    )
  })

  it('should be able to make a transfer if is a company', async () => {
    const client1 = makeClient({
      type: ClientType.COMPANY,
    })
    const client2 = makeClient()

    inMemoryClientRepository.items.push(client1, client2)

    const balanceClient1 = makeBalance({
      holderId: client1.id,
    })
    const balanceClient2 = makeBalance({
      holderId: client2.id,
    })

    inMemoryBalanceRepository.items.push(balanceClient1, balanceClient2)

    const response = await sut.execute({
      amount: 1000,
      receiverId: client2.id.toString(),
      senderId: client1.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UnauthorizedTransactionError)
  })

  it('should not be able to make a transfer to non existent client', async () => {
    const client1 = makeClient()

    inMemoryClientRepository.items.push(client1)

    const balanceClient1 = makeBalance({
      holderId: client1.id,
    })

    inMemoryBalanceRepository.items.push(balanceClient1)

    const response = await sut.execute({
      amount: 1000,
      receiverId: 'non existent',
      senderId: client1.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ClientDoesNotExistsError)
  })

  it('should not be able to receive a transfer if non existent client', async () => {
    const client1 = makeClient()

    inMemoryClientRepository.items.push(client1)

    const balanceClient1 = makeBalance({
      holderId: client1.id,
    })

    inMemoryBalanceRepository.items.push(balanceClient1)

    const response = await sut.execute({
      amount: 1000,
      receiverId: client1.id.toString(),
      senderId: 'non existent',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ClientDoesNotExistsError)
  })

  it('should not be able to make a transfer if not enought balance', async () => {
    const client1 = makeClient()
    const client2 = makeClient()

    inMemoryClientRepository.items.push(client1, client2)

    const balanceClient1 = makeBalance({
      holderId: client1.id,
      amount: 20,
    })
    const balanceClient2 = makeBalance({
      holderId: client2.id,
    })

    inMemoryBalanceRepository.items.push(balanceClient1, balanceClient2)

    const response = await sut.execute({
      amount: 1000,
      receiverId: client2.id.toString(),
      senderId: client1.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(InsufficientBalanceError)
  })

  it('should not be able to make a transfer if not valid', async () => {
    const client1 = makeClient()
    const client2 = makeClient()

    inMemoryClientRepository.items.push(client1, client2)

    const balanceClient1 = makeBalance({
      holderId: client1.id,
    })
    const balanceClient2 = makeBalance({
      holderId: client2.id,
    })

    inMemoryBalanceRepository.items.push(balanceClient1, balanceClient2)

    fakeTransactionValidator.isValid = false

    const response = await sut.execute({
      amount: 1000,
      receiverId: client2.id.toString(),
      senderId: client1.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UnauthorizedTransactionError)
  })
})
