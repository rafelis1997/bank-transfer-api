import { Either, right } from '@/core/either'
import { NotificationRepository } from '../repositories/notification-repository'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface SendNotificationUseCaseRequest {
  title: string
  content: string
  recipientId: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    content,
    recipientId,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      content,
      recipientId: new UniqueEntityID(recipientId),
      title,
    })

    await this.notificationRepository.create(notification)

    return right({
      notification,
    })
  }
}
