import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

export enum ClientType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

export interface CommonUserProps {
  name: string
  document: string
  email: string
  type?: ClientType
  password: string
  createdAt?: Date
  updatedAt?: Date | null
}

export class Common extends Entity<CommonUserProps> {
  get name() {
    return this.props.name
  }

  get document() {
    return this.props.document
  }

  get email() {
    return this.props.email
  }

  set email(value: string) {
    this.props.email = value
    this.touch()
  }

  get type() {
    return this.props.type
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: CommonUserProps, id?: UniqueEntityID) {
    const commonUser = new Common(
      {
        ...props,
        type: props.type ?? ClientType.INDIVIDUAL,
      },
      id,
    )

    return commonUser
  }
}
