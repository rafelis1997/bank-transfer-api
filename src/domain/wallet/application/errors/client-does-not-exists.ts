import { UseCaseError } from '@/core/errors/use-case-error'

export class ClientDoesNotExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Client does not exists`)
  }
}
