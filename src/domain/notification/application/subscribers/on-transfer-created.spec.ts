import { InMemoryClientRepository } from '@/tests/repositories/in-memory-client-repository'
import { InMemoryNotificationRepository } from '@/tests/repositories/in-memory-notification-repository'
import { InMemoryTransferRepository } from '@/tests/repositories/in-memory-transfer-repository'
import { MockInstance } from 'vitest'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryBalanceRepository } from '@/tests/repositories/in-memory-balance-repository'
import { OnTransferCreated } from './on-transfer-created'
import { makeClient } from '@/tests/factories/make-client'
import { makeBalance } from '@/tests/factories/make-balance'
import { makeTransfer } from '@/tests/factories/make-transfer'
import { waitFor } from '@/tests/utils/wait-for'

let inMemoryClientRepository: InMemoryClientRepository
let inMemoryBalanceRepository: InMemoryBalanceRepository
let inMemoryTransferRepository: InMemoryTransferRepository
let inMemoryNotificationRepository: InMemoryNotificationRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On transfer created', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    inMemoryBalanceRepository = new InMemoryBalanceRepository()
    inMemoryTransferRepository = new InMemoryTransferRepository()
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // eslint-disable-next-line no-new
    new OnTransferCreated(inMemoryClientRepository, sendNotificationUseCase)
  })

  it('should send notification on new transfer created', async () => {
    const client1 = makeClient()
    const balance1 = makeBalance({
      amount: 100,
      holderId: client1.id,
    })

    const client2 = makeClient()
    const balance2 = makeBalance({
      amount: 0,
      holderId: client2.id,
    })

    inMemoryClientRepository.items.push(client1)
    inMemoryClientRepository.items.push(client2)
    inMemoryBalanceRepository.items.push(balance1)
    inMemoryBalanceRepository.items.push(balance2)

    const transfer = makeTransfer({
      amount: 100,
      senderId: client1.id.toString(),
      receiverId: client2.id.toString(),
    })

    inMemoryTransferRepository.create(transfer)

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled())
  })
})
