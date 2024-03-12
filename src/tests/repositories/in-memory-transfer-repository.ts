import { DomainEvents } from '@/core/events/domain-events'
import { TransferRepository } from '@/domain/wallet/application/repositories/transfer-repository'
import { Transfer } from '@/domain/wallet/enterprise/entities/transfer'

export class InMemoryTransferRepository extends TransferRepository {
  public items: Transfer[] = []

  async findById(id: string): Promise<Transfer | null> {
    const transfer = this.items.find((item) => item.id.toString() === id)

    if (!transfer) {
      return null
    }

    return transfer
  }

  async fetchAllFromClient(clientId: string): Promise<Transfer[]> {
    const transfersMade = this.items.filter(
      (item) => item.senderId.toString() === clientId,
    )

    const transfersReceived = this.items.filter(
      (item) => item.receiverId.toString() === clientId,
    )

    return [...transfersReceived, ...transfersMade]
  }

  async create(transfer: Transfer): Promise<void> {
    this.items.push(transfer)

    DomainEvents.dispatchEventsForAggregate(transfer.id)
  }
}
