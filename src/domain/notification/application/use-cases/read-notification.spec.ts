import { InMemoryNotificationRepository } from '@/tests/repositories/in-memory-notification-repository'
import { ReadNotificationUseCase } from './read-notification'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('Read notification use case', () => {
  beforeAll(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = Notification.create({
      title: 'test notification',
      recipientId: new UniqueEntityID('test'),
      content: 'this is a test notification',
    })

    inMemoryNotificationRepository.items.push(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'test',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = Notification.create({
      title: 'test notification',
      recipientId: new UniqueEntityID('test'),
      content: 'this is a test notification',
    })

    inMemoryNotificationRepository.items.push(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'not same user',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
