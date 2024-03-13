import { Either, right } from '@/core/either'
import { NotificationRepository } from '../repositories/notification-repository'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SendEmailUseCase } from './send-email'
import { Injectable } from '@nestjs/common'

export interface SendNotificationUseCaseRequest {
  title: string
  content: string
  recipientId: string
  email: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private notificationRepository: NotificationRepository,
    private sendEmail: SendEmailUseCase,
  ) {}

  async execute({
    content,
    recipientId,
    title,
    email,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      content,
      recipientId: new UniqueEntityID(recipientId),
      title,
      email,
    })

    const hasSent = await this.sendEmail.send(email)

    if (hasSent) {
      notification.sent()
    }

    await this.notificationRepository.create(notification)

    return right({
      notification,
    })
  }
}
