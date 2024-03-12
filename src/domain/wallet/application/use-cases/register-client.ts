import { left, right, Either } from '@/core/either'
import { ClientType, Common } from '../../enterprise/entities/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { ClientAlreadyExistsError } from '../errors/client-already-exists-error'
import { ClientRepository } from '../repositories/clients-repository'
import { DocumentIsInvalidError } from '../errors/document-is-invalid'
import { BalanceRepository } from '../repositories/balance-repository'
import { Balance } from '@/domain/wallet/enterprise/entities/balance'
import { validateCnpj } from '../validation/cnpj-validator'
import { validateCpf } from '../validation/cpf-validator'

interface RegisterClientUseCaseRequest {
  name: string
  document: string
  email: string
  type: ClientType
  password: string
}

type RegisterClientUseCaseResponse = Either<
  ClientAlreadyExistsError | DocumentIsInvalidError,
  {
    client: Common
  }
>

const documentValidation = {
  company: (value: string) => validateCnpj(value),
  individual: (value: string) => validateCpf(value),
}

export class RegisterClientUseCase {
  constructor(
    private clientRepo: ClientRepository,
    private balanceRepo: BalanceRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    document,
    email,
    name,
    password,
    type,
  }: RegisterClientUseCaseRequest): Promise<RegisterClientUseCaseResponse> {
    const userWithSameEmail = await this.clientRepo.findByEmail(email)

    if (userWithSameEmail) {
      return left(new ClientAlreadyExistsError(email))
    }

    const serializedDocument = document.replace(/[^0-9]+/, '')

    const userWithSameDocument =
      await this.clientRepo.findByDocument(serializedDocument)

    if (userWithSameDocument) {
      return left(new ClientAlreadyExistsError(serializedDocument))
    }

    const validateDocumentFn =
      documentValidation[type as keyof typeof documentValidation]

    if (!validateDocumentFn(document)) {
      return left(new DocumentIsInvalidError(serializedDocument))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const client = Common.create({
      name,
      document,
      password: hashedPassword,
      email,
      type,
    })

    await this.clientRepo.create(client)

    const balance = await Balance.create({
      amount: 0,
      holderId: client.id,
      lastTransaction: null,
    })

    await this.balanceRepo.create(balance)

    return right({ client })
  }
}
