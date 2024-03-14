import { InMemoryNotificationRepository } from '@/tests/repositories/in-memory-notification-repository'
import { SendNotificationUseCase } from './send-notification'
import { SendEmailMock } from '@/tests/notification/send-email-mock'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sendMail: SendEmailMock
let sut: SendNotificationUseCase

describe('Send notification use case', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sendMail = new SendEmailMock()
    sut = new SendNotificationUseCase(inMemoryNotificationRepository, sendMail)
  })

  it('should be able to send notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      content: 'this is a notification',
      title: 'test',
      email: 'test@email.com',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
