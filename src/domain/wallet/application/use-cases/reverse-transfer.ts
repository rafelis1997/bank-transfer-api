import { Transfer } from '@/domain/wallet/enterprise/entities/transfer'
import { BalanceRepository } from '../repositories/balance-repository'
import { TransferRepository } from '../repositories/transfer-repository'
import { ClientRepository } from '../repositories/clients-repository'
import { Either, left, right } from '@/core/either'
import { ClientDoesNotExistsError } from '../errors/client-does-not-exists'
import { UnauthorizedTransactionError } from '../errors/unauthorized-transaction'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InsufficientBalanceError } from '../errors/insufficient-balance'
import { TransactionValidator } from '../validation/transaction-validator'
import { Injectable } from '@nestjs/common'

interface ReverseTransferUseCaseRequest {
  id: string
}

type ReverseTransferUseCaseResponse = Either<
  | ClientDoesNotExistsError
  | UnauthorizedTransactionError
  | ResourceNotFoundError
  | InsufficientBalanceError,
  {
    transfer: Transfer
  }
>

@Injectable()
export class ReverseTransferUseCase {
  constructor(
    private transferRepo: TransferRepository,
    private balanceRepo: BalanceRepository,
    private clientRepo: ClientRepository,
    private transactionValidator: TransactionValidator,
  ) {}

  async execute(
    reverseTransfer: ReverseTransferUseCaseRequest,
  ): Promise<ReverseTransferUseCaseResponse> {
    const transfer = await this.transferRepo.findById(reverseTransfer.id)

    if (!transfer) {
      return left(new ResourceNotFoundError())
    }

    const sender = await this.clientRepo.findById(transfer.receiverId)

    if (!sender) {
      return left(new ClientDoesNotExistsError())
    }

    const senderBalance = await this.balanceRepo.findByHolderId(
      transfer.receiverId,
    )

    if (!senderBalance) {
      return left(new ResourceNotFoundError())
    }

    const receiver = await this.clientRepo.findById(transfer.senderId)

    if (!receiver) {
      return left(new ClientDoesNotExistsError())
    }

    const receiverBalance = await this.balanceRepo.findByHolderId(
      transfer.senderId,
    )

    if (!receiverBalance) {
      return left(new ResourceNotFoundError())
    }

    senderBalance.amount -= transfer.amount
    senderBalance.lastTransaction = transfer.id.toString()

    receiverBalance.amount += transfer.amount
    receiverBalance.lastTransaction = transfer.id.toString()

    const newTransfer = Transfer.create({
      amount: transfer.amount,
      receiverId: transfer.senderId,
      senderId: transfer.receiverId,
    })

    const isValidTransfer =
      await this.transactionValidator.validate(newTransfer)

    if (!isValidTransfer) {
      return left(new UnauthorizedTransactionError())
    }

    await Promise.all([
      this.transferRepo.create(newTransfer),
      this.balanceRepo.save([senderBalance, receiverBalance]),
    ])

    return right({
      transfer,
    })
  }
}
