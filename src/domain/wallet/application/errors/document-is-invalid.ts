import { UseCaseError } from '@/core/errors/use-case-error'

export class DocumentIsInvalidError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Document "${identifier}" is invalid`)
  }
}
