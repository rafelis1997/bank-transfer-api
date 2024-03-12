import { Transfer } from '@/domain/wallet/enterprise/entities/transfer'
import { BalanceRepository } from '../repositories/balance-repository'
import { TransferRepository } from '../repositories/transfer-repository'
import { ClientRepository } from '../repositories/clients-repository'
import { Either, left, right } from '@/core/either'
import { ClientDoesNotExistsError } from '../errors/client-does-not-exists'
import { ClientType } from '@/domain/wallet/enterprise/entities/common'
import { UnauthorizedTransactionError } from '../errors/unauthorized-transaction'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InsufficientBalanceError } from '../errors/insufficient-balance'
import { TransactionValidator } from '../validation/transaction-validator'

interface CreateTransferUseCaseRequest {
  amount: number
  senderId: string
  receiverId: string
  description?: string
}

type CreateTransferUseCaseResponse = Either<
  | ClientDoesNotExistsError
  | UnauthorizedTransactionError
  | ResourceNotFoundError
  | InsufficientBalanceError,
  {
    transfer: Transfer
  }
>

export class CreateTransferUseCase {
  constructor(
    private transferRepo: TransferRepository,
    private balanceRepo: BalanceRepository,
    private clientRepo: ClientRepository,
    private transactionValidator: TransactionValidator,
  ) {}

  async execute(
    newTransfer: CreateTransferUseCaseRequest,
  ): Promise<CreateTransferUseCaseResponse> {
    const transfer = Transfer.create(newTransfer)

    const sender = await this.clientRepo.findById(transfer.senderId)

    if (!sender) {
      return left(new ClientDoesNotExistsError())
    }

    if (sender?.type === ClientType.COMPANY) {
      return left(new UnauthorizedTransactionError())
    }

    const senderBalance = await this.balanceRepo.findByHolderId(
      transfer.senderId,
    )

    if (!senderBalance) {
      return left(new ResourceNotFoundError())
    }

    const senderFinalBalance = senderBalance.amount - transfer.amount

    if (senderFinalBalance < 0) {
      return left(new InsufficientBalanceError())
    }

    const receiver = await this.clientRepo.findById(transfer.receiverId)

    if (!receiver) {
      return left(new ClientDoesNotExistsError())
    }

    const receiverBalance = await this.balanceRepo.findByHolderId(
      transfer.receiverId,
    )

    if (!receiverBalance) {
      return left(new ResourceNotFoundError())
    }

    senderBalance.amount -= transfer.amount
    senderBalance.lastTransaction = transfer.id.toString()

    receiverBalance.amount += transfer.amount
    receiverBalance.lastTransaction = transfer.id.toString()

    const isValidTransfer = await this.transactionValidator.validate(transfer)

    if (!isValidTransfer) {
      return left(new UnauthorizedTransactionError())
    }

    await Promise.all([
      this.transferRepo.create(transfer),
      this.balanceRepo.save([senderBalance, receiverBalance]),
    ])

    return right({
      transfer,
    })
  }
}
