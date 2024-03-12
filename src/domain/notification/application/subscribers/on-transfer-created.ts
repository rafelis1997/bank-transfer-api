import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { NewTransferEvent } from '@/domain/wallet/enterprise/events/new-transfer-event'
import { ClientRepository } from '@/domain/wallet/application/repositories/clients-repository'
import { MoneyFormater } from '@/utils/money-formater'

export class OnTransferCreated implements EventHandler {
  constructor(
    private clientRepo: ClientRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscription()
  }

  setupSubscription(): void {
    DomainEvents.register(
      this.SendNewTransferNotification.bind(this),
      NewTransferEvent.name,
    )
  }

  private async SendNewTransferNotification({ transfer }: NewTransferEvent) {
    const { receiverId, senderId } = transfer

    const sender = await this.clientRepo.findById(senderId)
    const receiver = await this.clientRepo.findById(receiverId)

    await this.sendNotification.execute({
      title: 'Você recebeu uma transferência',
      content: `Você recebeu uma transferência de ${sender?.name}, no valor de ${MoneyFormater(transfer.amount / 100)}`,
      recipientId: receiverId,
    })

    await this.sendNotification.execute({
      title: 'Você fez uma transferência',
      content: `Você fez uma transferência para ${receiver?.name}, no valor de ${MoneyFormater(transfer.amount / 100)}`,
      recipientId: senderId,
    })
  }
}
