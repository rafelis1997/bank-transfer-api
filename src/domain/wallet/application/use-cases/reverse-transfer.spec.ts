import { InMemoryBalanceRepository } from '@/tests/repositories/in-memory-balance-repository'
import { InMemoryClientRepository } from '@/tests/repositories/in-memory-client-repository'
import { InMemoryTransferRepository } from '@/tests/repositories/in-memory-transfer-repository'
import { FakeTransactionValidator } from '@/tests/validation/fake-transaction-validator'
import { makeClient } from '@/tests/factories/make-client'
import { makeBalance } from '@/tests/factories/make-balance'
import { ClientDoesNotExistsError } from '../errors/client-does-not-exists'
import { UnauthorizedTransactionError } from '../errors/unauthorized-transaction'
import { ReverseTransferUseCase } from './reverse-transfer'
import { makeTransfer } from '@/tests/factories/make-transfer'

let inMemoryBalanceRepository: InMemoryBalanceRepository
let inMemoryClientRepository: InMemoryClientRepository
let inMemoryTransferRepository: InMemoryTransferRepository
let fakeTransactionValidator: FakeTransactionValidator
let sut: ReverseTransferUseCase

describe('Reverse transfer use case', () => {
  beforeEach(() => {
    inMemoryBalanceRepository = new InMemoryBalanceRepository()
    inMemoryClientRepository = new InMemoryClientRepository()
    inMemoryTransferRepository = new InMemoryTransferRepository()
    fakeTransactionValidator = new FakeTransactionValidator()
    sut = new ReverseTransferUseCase(
      inMemoryTransferRepository,
      inMemoryBalanceRepository,
      inMemoryClientRepository,
      fakeTransactionValidator,
    )
  })

  it('should be able to reverse a transfer', async () => {
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

    const transfer = makeTransfer({
      receiverId: client2.id.toString(),
      senderId: client1.id.toString(),
    })

    inMemoryTransferRepository.items.push(transfer)

    const response = await sut.execute({
      id: transfer.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
    expect(inMemoryTransferRepository.items).toHaveLength(2)
    expect(
      inMemoryTransferRepository.items.sort((a, b) =>
        a.id.toString().localeCompare(b.id.toString()),
      )[1],
    ).toEqual(
      expect.objectContaining({
        amount: 1000,
        receiverId: client1.id.toString(),
        senderId: client2.id.toString(),
      }),
    )
  })

  it('should not be able to make a transfer to non existent client', async () => {
    const client1 = makeClient()

    inMemoryClientRepository.items.push(client1)

    const balanceClient1 = makeBalance({
      holderId: client1.id,
    })

    inMemoryBalanceRepository.items.push(balanceClient1)

    const transfer = makeTransfer({
      receiverId: 'teste',
      senderId: client1.id.toString(),
    })

    inMemoryTransferRepository.items.push(transfer)

    const response = await sut.execute({
      id: transfer.id.toString(),
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

    const transfer = makeTransfer({
      receiverId: client1.id.toString(),
      senderId: 'teste',
    })

    inMemoryTransferRepository.items.push(transfer)

    const response = await sut.execute({
      id: transfer.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ClientDoesNotExistsError)
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

    const transfer = makeTransfer({
      receiverId: client2.id.toString(),
      senderId: client1.id.toString(),
    })

    inMemoryTransferRepository.items.push(transfer)

    const response = await sut.execute({
      id: transfer.id.toString(),
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(UnauthorizedTransactionError)
  })
})
