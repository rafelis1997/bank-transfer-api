import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Prisma, Notification as PrismaNotification } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        content: raw.content,
        recipientId: new UniqueEntityID(raw.recipientId),
        title: raw.title,
        email: raw.email,
        createdAt: raw.createdAt,
        readAt: raw.readAt ?? undefined,
        sentAt: raw.sentAt ?? undefined,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    console.log(notification)
    return {
      id: notification.id.toString(),
      content: notification.content,
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      email: notification.email,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
      sentAt: notification.sentAt,
    }
  }
}
