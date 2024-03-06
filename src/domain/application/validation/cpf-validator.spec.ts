import { validateCpf } from './cpf-validator'

describe('CPF validator', () => {
  it('should be consider cpf as valid', () => {
    const isValid = validateCpf('12345678909')

    expect(isValid).toBeTruthy()
  })

  it('should not validate cpf with only repeated numbers', () => {
    const isValid = validateCpf('22222222222')

    expect(isValid).toBeFalsy()
  })

  it('should not be consider cpf as valid', () => {
    const isValid = validateCpf('27110042013')

    expect(isValid).toBeFalsy()
  })
})
