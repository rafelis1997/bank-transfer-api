import { Retry } from './retry'

class PromiseMock {
  private _promises: Promise<unknown>[]

  constructor(promises: Promise<unknown>[]) {
    this._promises = promises
  }

  init() {
    return this.executePile()
  }

  async executePile() {
    const promise = this._promises.splice(0, 1)

    return promise[0]
  }
}

describe('Retry pattern', () => {
  it('should be able to resolve in first try', async () => {
    const promiseMock = new PromiseMock([
      Promise.resolve({ message: 'resolved' }),
    ])

    const result = await new Retry().init({
      requestCallBack: () => promiseMock.executePile(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ response: { message: 'resolved' } })
  })

  it('should be able to resolve in second try', async () => {
    const promiseMock = new PromiseMock([
      Promise.reject(new Error()),
      Promise.resolve({ message: 'resolved' }),
    ])

    const result = await new Retry().init({
      requestCallBack: () => promiseMock.executePile(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ response: { message: 'resolved' } })
  })
})
