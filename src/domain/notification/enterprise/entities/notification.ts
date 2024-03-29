import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface NotificationProps {
  recipientId: UniqueEntityID
  title: string
  content: string
  createdAt: Date
  email: string
  readAt?: Date
  sentAt?: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get email() {
    return this.props.email
  }

  get readAt() {
    return this.props.readAt
  }

  get sentAt() {
    return this.props.sentAt
  }

  public sent() {
    this.props.sentAt = new Date()
  }

  public read() {
    this.props.readAt = new Date()
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return notification
  }
}
