import { UseCaseError } from '../use-case-error'

export class TooManyTriesError extends Error implements UseCaseError {
  constructor() {
    super('Retries exceeded!')
  }
}
