export function validateCnpj(value: string) {
  if (value.length !== 14) return false

  const invalidCNPJ = [
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999',
  ]

  if (invalidCNPJ.includes(value)) return false

  const firstDigitSum = value
    .split('')
    .slice(0, 12)
    .reverse()
    .reduce((acc, digit, index) => {
      const weight = index <= 7 ? 2 + index : 2 + index - 8

      return (acc += Number(digit) * weight)
    }, 0)

  const firstDigitCalc = firstDigitSum % 11

  const firstDigitCheck = firstDigitCalc <= 1 ? 11 - 0 : 11 - firstDigitCalc

  if (firstDigitCheck !== Number(value[12])) return false

  const secondDigitSum = value
    .split('')
    .slice(0, 13)
    .reverse()
    .reduce((acc, digit, index) => {
      const weight = index <= 7 ? 2 + index : 2 + index - 8

      return (acc += Number(digit) * weight)
    }, 0)

  const secondDigitCalc = secondDigitSum % 11

  const secondDigitCheck = secondDigitCalc <= 1 ? 11 - 0 : 11 - secondDigitCalc

  if (secondDigitCheck !== Number(value[13])) return false

  return true
}
