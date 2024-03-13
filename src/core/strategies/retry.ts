import { Either, left, right } from '../either'
import { TooManyTriesError } from '../errors/errors/too-many-tries'

export interface RetryInitRequest {
  requestCallBack: () => Promise<unknown>
  failureCounter?: number
}

type RetryResponse<T> = Either<TooManyTriesError, { response: T }>

export class Retry {
  private _failureCounter: number = 3
  async init<T>({
    requestCallBack,
    failureCounter,
  }: RetryInitRequest): Promise<RetryResponse<T>> {
    if (failureCounter) {
      this._failureCounter = failureCounter
    }

    return await this.processRequest(requestCallBack)
  }

  async processRequest<T>(
    request: () => Promise<unknown>,
  ): Promise<RetryResponse<T>> {
    try {
      const response = await request()

      return right({ response: response as T })
    } catch (error) {
      this._failureCounter -= 1

      console.log(request)
      if (this._failureCounter === 0) {
        return left(new TooManyTriesError())
      }

      return await this.processRequest(request)
    }
  }
}
