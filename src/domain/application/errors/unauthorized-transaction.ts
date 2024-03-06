import { UseCaseError } from '../../../core/errors/use-case-error'

export class UnauthorizedTransactionError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Unauthorized transaction`)
  }
}
