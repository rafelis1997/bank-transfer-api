import { Entity } from '../../../core/entities/entity'
import { UniqueEntityID } from '../../../core/entities/unique-entity-id'

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

  get type() {
    return this.props.type
  }

  get password() {
    return this.props.password
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
