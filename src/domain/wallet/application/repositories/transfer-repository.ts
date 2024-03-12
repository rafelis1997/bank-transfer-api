import { Transfer } from '../../enterprise/entities/transfer'

export abstract class TransferRepository {
  abstract findById(id: string): Promise<Transfer | null>
  abstract fetchAllFromClient(clientId: string): Promise<Transfer[]>
  abstract create(transfer: Transfer): Promise<void>
}
