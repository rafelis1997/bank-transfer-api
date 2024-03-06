import { validateCnpj } from './cnpj-validator'

describe('CNPJ validator', () => {
  it('should be consider CNPJ as valid', () => {
    const isValid = validateCnpj('14572457000185')

    expect(isValid).toBeTruthy()
  })

  it('should not validate cnpj with only repeated numbers', () => {
    const isValid = validateCnpj('00000000000000')

    expect(isValid).toBeFalsy()
  })

  it('should not be consider cnpj as valid', () => {
    const isValid = validateCnpj('14572457000188')

    expect(isValid).toBeFalsy()
  })
})
